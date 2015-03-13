using System.Web;
using System.Web.Optimization;

namespace microwiki
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/pagedown").Include(
                      "~/Scripts/Markdown.Converter.js",
                      "~/Scripts/Markdown.Sanitizer.js",
                      "~/Scripts/Markdown.Editor.js"));

            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                      "~/Scripts/main.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/pagedown.css",
                      "~/Content/main.css"));
        }
    }
}
