using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace microwiki.Web.Controllers
{
    public class WikiController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
