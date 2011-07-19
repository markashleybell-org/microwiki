using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace microwiki.Web.Helpers
{
    public static class Formatting
    {
        public static string Title(this string s)
        {
            var elements = s.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            return elements[elements.Length - 1];
        }
    }
}