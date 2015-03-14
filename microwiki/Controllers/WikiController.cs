using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dapper;
using microwiki.Models;
using mab.lib.SimpleMapper;
using System.Net;
using System.Text.RegularExpressions;
using MarkdownSharp;

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
                Slug = CreateSlug(model.Title),
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
                model.Body = _markdown.Transform(model.Body);
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

                return View(model);
            }
        }

        [HttpPost]
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
                Slug = model.Slug,
                Username = User.Identity.Name
            };

            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                var location = _db.ExecuteScalar<string>(sql, data);

                return Redirect(location);
            }
        }

        public ActionResult Delete()
        {
            return View();
        }

        public ActionResult Search()
        {
            return View();
        }

        private string CreateSlug(string input)
        {
            var options = RegexOptions.IgnoreCase | RegexOptions.Singleline;

            // Remove all special chars (but not spaces or dashes)
            string output = Regex.Replace(input, @"[^a-z0-9\s\-]", "", options);
            // Replace spaces with hyphens
            output = Regex.Replace(output, @"[\s]", "-", options);
            // Replace multiple hyphens (more than one in a row) with a single hyphen
            output = Regex.Replace(output, @"\-{2,}", "-", options);
            // Trim extra hyphen off the end if exists
            if(output.EndsWith("-"))
                output = output.Substring(0, output.Length - 1);

            return output.ToLower();
        }
    }
}