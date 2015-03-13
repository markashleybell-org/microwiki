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

namespace microwiki.Controllers
{
    public class WikiController : Controller
    {
        private string _connString;
        private SqlConnection _db;

        public WikiController()
        {
            _connString = ConfigurationManager.ConnectionStrings["Main"].ConnectionString;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        public ActionResult Read(string location)
        {
            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                var document = _db.Query<Document>("SELECT * FROM Documents WHERE Location = @Location", new { Location = (string.IsNullOrWhiteSpace(location) ? "home" : location) }).FirstOrDefault();
                return View(document.MapTo<DocumentViewModel>());
            }

            
        }

        public ActionResult Update()
        {
            return View();
        }

        public ActionResult Delete()
        {
            return View();
        }
    }
}