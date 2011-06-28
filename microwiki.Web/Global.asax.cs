using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Configuration;
using System.Data.SqlServerCe;
using System.IO;
using System.Text.RegularExpressions;

namespace microwiki.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void CreateDatabase(string connectionString)
        {
            var databaseFile = Regex.Match(connectionString, "Data Source=(.*?)(?:;|$)", RegexOptions.IgnoreCase).Groups[1].Value;

            if(databaseFile != null && !File.Exists(databaseFile))
            {
                var engine = new SqlCeEngine(connectionString);

                engine.CreateDatabase();

                using (var conn = new SqlCeConnection(connectionString))
                {
                    conn.Open();

                    var cmd = new SqlCeCommand();
                    cmd.Connection = conn;

                    using (var reader = File.OpenText(AppDomain.CurrentDomain.BaseDirectory + "\\Infrastructure\\Schema.sql"))
                    {
                        while (reader.Peek() >= 0)
                        {
                            cmd.CommandText = Regex.Replace(reader.ReadLine(), "@@NOW@@", DateTime.Now.ToString("yyyy-MM-dd hh:mm"));
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
        }

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Wiki", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            CreateDatabase(ConfigurationManager.ConnectionStrings["MicroWiki"].ConnectionString);
        }
    }
}