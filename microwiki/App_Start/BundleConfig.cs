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

            bundles.Add(new ScriptBundle("~/bundles/prettify").Include(
                      "~/Scripts/Prettify/prettify.js",
                      "~/Scripts/Prettify/lang-css.js",
                      "~/Scripts/Prettify/lang-sql.js"));

            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                      "~/Scripts/main.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/pagedown.css",
                      "~/Content/Prettify/prettify.css",
                      "~/Content/Prettify/Themes/desert.css",
                      //"~/Content/Prettify/Themes/sons-of-obsidian.css",
                      //"~/Content/Prettify/Themes/github.css",
                      //"~/Content/Prettify/Themes/tomorrow-night-bright.css",
                      //"~/Content/Prettify/Themes/hemisu-dark.css",
                      "~/Content/main.css"));
        }
    }
}
