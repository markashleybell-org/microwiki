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

namespace microwiki.Controllers
{
    public class WikiController : Controller
    {
        private string _connString;
        private SqlConnection _db;

        private Markdown _markdown;

        public WikiController()
        {
            _connString = ConfigurationManager.ConnectionStrings["Main"].ConnectionString;

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

                var document = _db.Query<Document>("SELECT * FROM Documents WHERE Location = @Location", new { Location = "/"+ location }).FirstOrDefault();

                if (document == null)
                    throw new HttpException((int)HttpStatusCode.NotFound, "Not Found");

                var model = document.MapTo<DocumentReadViewModel>();
                model.Body = WikiHelpers.AddCodeHintClasses(_markdown.Transform(model.Body));
                model.Children = _db.Query<DocumentReadViewModel>("SELECT * FROM Documents WHERE ParentID = @ID AND ID != @ID", new { ID = document.ID }).ToList();

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
                var document = _db.Query<Document>("SELECT * FROM Documents WHERE ID = @ID", new { ID = id }).FirstOrDefault();

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
            return View();
        }

        [HttpPost]
        public ActionResult Move(string id, string parentID)
        {
            var sql = "EXEC mw_Move_Document @ID, @ParentID, @Username";

            var data = new
            {
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

        public ActionResult SiteMap()
        {
            return View();
        }

        public ActionResult WikiTreeView(string id)
        {
            using (_db = new SqlConnection(_connString))
            {
                _db.Open();

                var documents = _db.Query<DocumentSiteMapViewModel>("SELECT ID, ParentID, Location, Title FROM Documents").ToList();

                var root = documents.Where(x => x.ID == x.ParentID).First();

                documents.Remove(root);

                WikiHelpers.BuildNode(documents, root, id);

                return View(new WikiTreeViewModel { Root = root, ID = id });
            }
        }

        public ActionResult Search()
        {
            return View();
        }
    }
}