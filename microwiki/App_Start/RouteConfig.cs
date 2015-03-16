﻿using System.Web.Mvc;
using System.Web.Routing;

namespace microwiki
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.LowercaseUrls = true;

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "SiteMap",
                url: "wiki/sitemap",
                defaults: new { controller = "Wiki", action = "SiteMap" }
            );

            routes.MapRoute(
                name: "Create",
                url: "wiki/create/{parentid}",
                defaults: new { controller = "Wiki", action = "Create" }
            );

            routes.MapRoute(
                name: "Update",
                url: "wiki/update/{id}",
                defaults: new { controller = "Wiki", action = "Update" }
            );

            routes.MapRoute(
                name: "Delete",
                url: "wiki/delete/{id}",
                defaults: new { controller = "Wiki", action = "Delete" }
            );

            routes.MapRoute(
                name: "Read",
                url: "{*location}",
                defaults: new { controller = "Wiki", action = "Read" }
            );
        }
    }
}