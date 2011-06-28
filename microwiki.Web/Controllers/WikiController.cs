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

        public WikiController() : base() 
        { 
            _markdown = new Markdown();
        }

        public ActionResult Index()
        {
            var documents = new Documents();

            var document = documents.Single(1);

            return View(new DocumentViewModel {
                Title = document.Title,
                Created = document.Created,
                LastEdited = document.LastEdited,
                Body = _markdown.Transform(document.Body)
            });
        }
    }
}
