using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dapper;
using microwiki.Models;
using mab.lib.SimpleMapper;
using System.Net;
using MarkdownSharp;
using microwiki.Helpers;
using System.Collections.Generic;
using System.IO;

namespace microwiki.Controllers
{
    [BasicAuth]
    public class WikiController : Controller
    {
        private string _connString;
        private SqlConnection _db;

        private Markdown _markdown;

        public WikiController()
        {
            _connString = ConfigurationManager.ConnectionStrings["microwiki"].ConnectionString;

            var options = new MarkdownOptions();
            options.AutoHyperlink = true;

            _markdown = new Markdown(options);
        }

        [HttpGet]
        public ActionResult Create(string parentID)
        {
            if (string.IsNullOrWhiteSpace(parentID))
                throw new HttpException((int)HttpStatusCode.InternalServerError, "Missing Parent Document ID");

            return View(new DocumentCreateViewModel { ParentID = parentID });
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Create(DocumentCreateViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var sql = "EXEC mw_Create_Document @ID, @ParentID, @Title, @Body, @Slug, @Username";

            var data = new {
                ID = Guid.NewGuid().ToString().ToLower(),
                ParentID = model.ParentID,
                Title = model.Title,
                Body = model.Body,
                Slug = WikiHelpers.CreateSlug(model.Title),
                Username = User.Identity.Name
            };

            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                var location = _db.ExecuteScalar<string>(sql, data);

                return Redirect(location);
            }
        }

        public ActionResult Read(string location)
        {
            using (_db = new SqlConnection(_connString))
            {
                _db.Open();

                var model = _db.Query<DocumentReadViewModel>("EXEC mw_Read_Document NULL, @Location", new { Location = "/" + location }).FirstOrDefault();

                if (model == null)
                    throw new HttpException((int)HttpStatusCode.NotFound, "Not Found");

                model.Body = WikiHelpers.AddCodeHintClasses(_markdown.Transform(model.Body));
                model.Children = _db.Query<DocumentReadViewModel>("EXEC mw_Read_Documents @ParentID", new { ParentID = model.ID }).ToList();

                return View(model);
            }
        }

        [HttpGet]
        public ActionResult Update(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new HttpException((int)HttpStatusCode.InternalServerError, "Missing Document ID");

            using (_db = new SqlConnection(_connString))
            {
                var document = _db.Query<Document>("EXEC mw_Read_Document @ID, NULL", new { ID = id }).FirstOrDefault();

                if (document == null)
                    throw new HttpException((int)HttpStatusCode.NotFound, "Not Found");

                var model = document.MapTo<DocumentUpdateViewModel>();
                model.IsRoot = (model.ParentID == model.ID);

                return View(model);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Update(DocumentUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var sql = "EXEC mw_Update_Document @ID, @ParentID, @Title, @Body, @Slug, @Username";

            var data = new {
                ID = model.ID,
                ParentID = model.ParentID,
                Title = model.Title,
                Body = model.Body,
                Slug = WikiHelpers.CreateSlug(model.Slug),
                Username = User.Identity.Name
            };

            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                var location = _db.ExecuteScalar<string>(sql, data);

                return Redirect(location);
            }
        }

        [HttpPost]
        public ActionResult Delete(string id)
        {
            var sql = "EXEC mw_Delete_Document @ID, @Username";

            var data = new {
                ID = id,
                Username = User.Identity.Name
            };

            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                _db.Execute(sql, data);

                return Redirect("/");
            }
        }

        [HttpPost]
        public ActionResult Move(string id, string parentID)
        {
            var sql = "EXEC mw_Move_Document @ID, @ParentID, @Username";

            var data = new {
                ID = id,
                ParentID = parentID,
                Username = User.Identity.Name
            };

            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                var location = _db.ExecuteScalar<string>(sql, data);

                return Json(new { location = location });
            }
        }

        public ActionResult Upload(string uploadedFileName)
        {
            return View(new UploadViewModel { 
                UploadedFileName = uploadedFileName,
                Files = Directory.GetFiles(Server.MapPath("/UserContent"))
            });
        }

        [HttpPost]
        public ActionResult Upload(UploadViewModel model)
        {
            var file = model.UploadedFile;

            if(file == null)
                return RedirectToAction("Upload");

            var uploadedFilePath = new FileSystemFileUploader().UploadFile(file, Server.MapPath("/UserContent"), Path.GetFileName(file.FileName));

            return RedirectToAction("Upload", new { UploadedFileName = uploadedFilePath });
        }

        [HttpPost]
        public ActionResult DeleteUpload(DeleteUploadViewModel model)
        {
            var fileName = Server.MapPath(model.Path);

            if (System.IO.File.Exists(fileName))
            {
                // Check if the file is used anywhere
                using (_db = new SqlConnection(_connString))
                {
                    _db.Open();
                    model.UsedInPages = _db.Query<DocumentSiteMapViewModel>("EXEC mw_Check_File_Use @Location", new { Location = model.Path }).ToList();

                    if (model.UsedInPages != null && model.UsedInPages.Count > 0)
                        return View(model);
                }

                System.IO.File.Delete(fileName);
            }
            
            return RedirectToAction("Upload");
        }

        public ActionResult Breadcrumb(string id)
        {
            using (_db = new SqlConnection(_connString))
            {
                _db.Open();

                var trailData = _db.ExecuteScalar<string>("EXEC mw_Get_Breadcrumb_Trail @ID", new { ID = id });

                var links = trailData.Split('|')
                                     .Select(x => x.Split('^'))
                                     .Select(x => new Tuple<string, string>(x[0], x[1]))
                                     .ToList();

                return View(new BreadcrumbViewModel { Links = links });
            }
        }

        public ActionResult SiteMap()
        {
            return View();
        }

        public ActionResult WikiTreeView(string id)
        {
            using (_db = new SqlConnection(_connString))
            {
                _db.Open();

                var documents = _db.Query<DocumentSiteMapViewModel>("EXEC mw_Read_Documents").ToList();

                var root = documents.Where(x => x.ID == x.ParentID).First();

                documents.Remove(root);

                WikiHelpers.BuildNode(documents, root, id);

                return View(new WikiTreeViewModel { Root = root, ID = id });
            }
        }

        public ActionResult Search(string q)
        {
            using (_db = new SqlConnection(_connString))
            {
                _db.Open();

                return View(new DocumentSearchViewModel { 
                    Query = q, 
                    Results = _db.Query<DocumentReadViewModel>("EXEC mw_Search_Documents @Query", new { Query = q }).ToList()
                });
            }
        }
    }
}