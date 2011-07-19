using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

namespace microwiki.Web.Helpers
{
    public static class Widgets
    {
        public static MvcHtmlString Breadcrumb(this string url)
        {
            var fragments = url.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

            var output = new List<string>();
            var path = "";

            foreach(var fragment in fragments)
            {
                path += "/" + fragment;
                output.Add("<a href=\"" + path + "\">" + fragment + "</a>");
            }

            return new MvcHtmlString("<a href=\"/\">root</a>" + ((output.Count > 0) ? " / " + string.Join(" / ", output.ToArray()) : ""));
        }
    }
}