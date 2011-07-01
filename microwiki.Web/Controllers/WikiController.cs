using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using microwiki.Web.Models;
using MarkdownSharp;
using microwiki.Web.Data;

namespace microwiki.Web.Controllers
{
    public class WikiController : Controller
    {
        private Markdown _markdown;

        public WikiController()
        { 
            _markdown = new Markdown();
        }

        public ActionResult Document(string location)
        {
            var documents = new Documents();

            var document = documents.Single("Location = '/" + location + "'");

            var children = documents.All(columns: "Location, Title", where: "WHERE Location LIKE @0 + '%'", args: "/" + location);

            return View(new DocumentViewModel {
                Location = document.Location,
                Title = document.Title,
                Created = document.Created,
                LastEdited = document.LastEdited,
                Body = _markdown.Transform(document.Body),
                Children = children.ToList()
            });
        }

        [HttpPost]
        public ActionResult Get(string location)
        {
            var documents = new Documents();

            var document = documents.Single("Location = '/" + location + "'");

            return Json(new { title = document.Title, location = document.Location, body = document.Body });
        }

        [HttpPost]
        public ActionResult Insert(string title, string location, string body, string redirect)
        {
            var documents = new Documents();

            documents.Insert(new {
                Title = title,
                Location = "/" + location,
                Created = DateTime.Now, 
                LastEdited = DateTime.Now, 
                Body = body 
            });

            if (redirect != null && int.Parse(redirect) == 1)
                return Redirect(location);

            return Json(new { updatedTitle = title, updatedBody = _markdown.Transform(body) });
        }

        [HttpPost]
        public ActionResult Update(string title, string location, string body)
        {
            var documents = new Documents();

            documents.Update(new { 
                Title = title,
                LastEdited = DateTime.Now, 
                Body = body
            }, "/" + location);

            return Json(new { updatedTitle = title, updatedBody = _markdown.Transform(body) });
        }

        [HttpPost]
        public ActionResult Delete(string location)
        {
            return Content("");
        }
    }
}
