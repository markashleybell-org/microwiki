using System.Web.Mvc;
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
                name: "Search",
                url: "wiki/search",
                defaults: new { controller = "Wiki", action = "Search" }
            );

            routes.MapRoute(
                name: "Upload",
                url: "wiki/upload",
                defaults: new { controller = "Wiki", action = "Upload" }
            );

            routes.MapRoute(
                name: "DeleteUpload",
                url: "wiki/deleteupload",
                defaults: new { controller = "Wiki", action = "DeleteUpload" }
            );

            routes.MapRoute(
                name: "Breadcrumb",
                url: "wiki/breadcrumb/{id}",
                defaults: new { controller = "Wiki", action = "Breadcrumb", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "WikiTreeView",
                url: "wiki/wikitreeview/{id}",
                defaults: new { controller = "Wiki", action = "WikiTreeView", id = UrlParameter.Optional }
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
                url: "wiki/delete",
                defaults: new { controller = "Wiki", action = "Delete" }
            );

            routes.MapRoute(
                name: "Move",
                url: "wiki/move",
                defaults: new { controller = "Wiki", action = "Move" }
            );

            routes.MapRoute(
                name: "Read",
                url: "{*location}",
                defaults: new { controller = "Wiki", action = "Read" }
            );
        }
    }
}
