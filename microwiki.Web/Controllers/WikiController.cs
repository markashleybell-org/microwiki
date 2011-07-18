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

        public ActionResult Document(string location = "")
        {
            var documents = new Documents();

            location = (location == "") ? "root" : "root/" + location;

            var depth = (from c in location
                         where c == '/'
                         select c).Count();

            var document = documents.Single("Location = '" + location + "'");

            var children = documents.All(columns: "Location, Title", where: "WHERE Location <> @0", args: location).ToList();

            return View(new DocumentViewModel {
                Location = document.Location,
                Title = document.Title,
                Created = document.Created,
                LastEdited = document.LastEdited,
                Body = _markdown.Transform(document.Body),
                Children = children.FindAll(delegate(dynamic d) {
                    
                    // Only return documents which are direct children
                    int count = 0;

                    foreach (char c in d.Location)
                    {
                        if (c == '/')
                        {
                            count++;
                        }
                    }

                    var locTmp = ((depth > 0) ? location + "/" : "");
                    var isChild = d.Location.StartsWith(locTmp);
                    var childDepth = (count == (depth + 1));

                    return childDepth && isChild;
                })
            });
        }

        [HttpPost]
        public ActionResult Get(string location)
        {
            location = (location == "") ? "root" : "root/" + location;

            var documents = new Documents();

            var document = documents.Single("Location = '" + location + "'");

            return Json(new { title = document.Title, location = document.Location, body = document.Body });
        }

        [HttpPost]
        public ActionResult Insert(string title, string location, string body, string redirect)
        {
            var documents = new Documents();

            documents.Insert(new {
                Title = title,
                Location = "root/" + location,
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
            location = (location == "") ? "root" : "root/" + location;

            var documents = new Documents();

            documents.Update(new { 
                Title = title,
                LastEdited = DateTime.Now, 
                Body = body
            }, location);

            return Json(new { updatedTitle = title, updatedBody = _markdown.Transform(body) });
        }

        [HttpPost]
        public ActionResult Delete(string location)
        {
            return Content("");
        }
    }
}
