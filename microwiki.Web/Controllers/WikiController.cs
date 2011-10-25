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
            var options = new MarkdownOptions();
            options.AutoHyperlink = true;

            _markdown = new Markdown(options);
        }

        public ActionResult Document(string location = "")
        {
            var documents = new Documents();

            location = (location == "") ? "root" : "root/" + location;

            var depth = (from c in location
                         where c == '/'
                         select c).Count();

            var document = documents.Single("Location = @0", args: location);

            var children = documents.All(columns: "Location", where: "WHERE Location <> @0", args: location).ToList();

            var filtered = from d in children.FindAll(delegate(dynamic d) {
                    
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
                           select new DocumentViewModel {
                               Location = d.Location
                           };

            return View(new DocumentViewModel {
                ID = document.ID,
                Location = document.Location,
                Created = document.Created,
                LastEdited = document.LastEdited,
                Body = _markdown.Transform(document.Body),
                Children = filtered.ToList()
            });
        }

        public ActionResult Add()
        {
            return View();
        }

        public ActionResult Edit(string loc = "")
        {
            loc = (loc == "") ? "root" : "root/" + loc;

            var documents = new Documents();

            var document = documents.Single("Location = @0", args: loc);

            return View(new DocumentViewModel {
                ID = document.ID,
                Location = (document.Location.Length > 5) ? document.Location.Substring(5) : document.Location,
                Body = document.Body
            });
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Insert(string location, string body, string redirect)
        {
            var documents = new Documents();

            documents.Insert(new {
                ID = Guid.NewGuid().ToString(),
                Location = "root/" + location,
                Created = DateTime.Now, 
                LastEdited = DateTime.Now, 
                Body = body 
            });

            return Redirect("/" + location);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Update(string id, string body, string location = "")
        {
            var documents = new Documents();

            documents.Update(new {
                Location = (location == "") ? "root" : "root/" + location,
                LastEdited = DateTime.Now, 
                Body = body
            }, id);

            return Redirect("/" + location);
        }

        [HttpPost]
        public ActionResult Delete(string id)
        {
            var documents = new Documents();

            documents.Delete(id);

            return Redirect("/");
        }
    }
}
