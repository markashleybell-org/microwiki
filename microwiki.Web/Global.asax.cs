﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Configuration;
using System.IO;
using System.Text.RegularExpressions;
using System.Data.SqlClient;

namespace microwiki.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void CreateTables(string connectionString)
        {
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                var cmd = new SqlCommand();
                cmd.Connection = conn;

                using (var reader = File.OpenText(AppDomain.CurrentDomain.BaseDirectory + "\\Infrastructure\\Schema.sql"))
                {
                    var schema = reader.ReadToEnd();

                    cmd.CommandText = Regex.Replace(schema, "@@NOW@@", DateTime.Now.ToString("yyyy-MM-dd hh:mm"));

                    try
                    {
                        cmd.ExecuteNonQuery();
                    }
                    catch (SqlException e)
                    {
                        
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
                "Get", // Route name
                "get", // URL with parameters
                new { controller = "Wiki", action = "Get" } // Parameter defaults
            );

            routes.MapRoute(
                "Insert", // Route name
                "insert", // URL with parameters
                new { controller = "Wiki", action = "Insert" } // Parameter defaults
            );

            routes.MapRoute(
                "Update", // Route name
                "update", // URL with parameters
                new { controller = "Wiki", action = "Update" } // Parameter defaults
            );

            routes.MapRoute(
                "Delete", // Route name
                "delete", // URL with parameters
                new { controller = "Wiki", action = "Delete" } // Parameter defaults
            );

            routes.MapRoute(
                "Page", // Route name
                "{*url}", // URL with parameters
                new { controller = "Wiki", action = "Page", url = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            CreateTables(ConfigurationManager.ConnectionStrings["microwiki"].ConnectionString);
        }
    }
}