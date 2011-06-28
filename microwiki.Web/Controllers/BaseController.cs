using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using microwiki.Domain.Abstract;

namespace microwiki.Web.Controllers 
{
    public class BaseController : Controller
    {
        protected IDocumentRepository _documents;

        public BaseController(IDocumentRepository documents)
        {
            _documents = documents;
        }
    }
}