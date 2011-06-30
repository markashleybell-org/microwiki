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

        public ActionResult Page(string url)
        {
            var documents = new Documents();

            var document = documents.Single("Location = '/" + url + "'");

            return View(new DocumentViewModel {
                Title = document.Title,
                Created = document.Created,
                LastEdited = document.LastEdited,
                Body = _markdown.Transform(document.Body)
            });
        }

        [HttpPost]
        public ActionResult Get(string url)
        {
            var documents = new Documents();

            var document = documents.Single("Location = '/" + url + "'");

            return Json(new { location = document.Location, body = document.Body });
        }

        [HttpPost]
        public ActionResult Insert(string url, string body)
        {
            return Content("");
        }

        [HttpPost]
        public ActionResult Update(string url, string body)
        {
            var documents = new Documents();

            documents.Update(new { LastEdited = DateTime.Now, Body = body }, "/" + url);

            return Json(new { update = _markdown.Transform(body) });
        }

        [HttpPost]
        public ActionResult Delete(string url)
        {
            return Content("");
        }
    }
}
