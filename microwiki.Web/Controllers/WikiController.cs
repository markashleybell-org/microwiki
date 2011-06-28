using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using microwiki.Domain.Abstract;
using microwiki.Web.Models;
using MarkdownSharp;

namespace microwiki.Web.Controllers
{
    public class WikiController : BaseController
    {
        private Markdown _markdown;

        public WikiController(IDocumentRepository documents) : base(documents) 
        { 
            _markdown = new Markdown();
        }

        public ActionResult Index()
        {
            var document = _documents.Get(1);

            return View(new DocumentViewModel {
                Title = document.Title,
                Created = document.Created,
                LastEdited = document.LastEdited,
                Body = _markdown.Transform(document.Body)
            });
        }
    }
}
