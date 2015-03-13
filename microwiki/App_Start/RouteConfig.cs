using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace microwiki
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Wiki",
                url: "wiki/{action}/{id}",
                defaults: new { controller = "Wiki", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Document",
                url: "{location}",
                defaults: new { controller = "Wiki", action = "Read", location = UrlParameter.Optional }
            );
        }
    }
}
