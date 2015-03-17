using HtmlAgilityPack;
using microwiki.Models;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using System.Text;
using System;

namespace microwiki.Helpers
{
    public static class WikiHelpers
    {
        public static string GetUniqueCode()
        {
            string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            string ticks = DateTime.UtcNow.Ticks.ToString();
            var code = "";
            for (var i = 0; i < characters.Length; i += 2)
            {
                if ((i + 2) <= ticks.Length)
                {
                    var number = int.Parse(ticks.Substring(i, 2));
                    if (number > characters.Length - 1)
                    {
                        var one = double.Parse(number.ToString().Substring(0, 1));
                        var two = double.Parse(number.ToString().Substring(1, 1));
                        code += characters[Convert.ToInt32(one)];
                        code += characters[Convert.ToInt32(two)];
                    }
                    else
                        code += characters[number];
                }
            }
            return code;
        }

        public static string CreateSlug(string input)
        {
            var options = RegexOptions.IgnoreCase | RegexOptions.Singleline;

            // Remove all special chars (but not spaces or dashes)
            string output = Regex.Replace(input, @"[^a-z0-9\s\-]", "", options);
            // Replace spaces with hyphens
            output = Regex.Replace(output, @"[\s]", "-", options);
            // Replace multiple hyphens (more than one in a row) with a single hyphen
            output = Regex.Replace(output, @"\-{2,}", "-", options);
            // Trim extra hyphen off the end if exists
            if (output.EndsWith("-"))
                output = output.Substring(0, output.Length - 1);

            return output.ToLower();
        }

        public static void BuildNode(List<DocumentSiteMapViewModel> documents, DocumentSiteMapViewModel document, string id)
        {
            foreach (var d in documents)
            {
                if (d.ParentID == document.ID)
                {
                    if (document.Children == null)
                        document.Children = new List<DocumentSiteMapViewModel>();

                    document.Children.Add(d);

                    BuildNode(documents, d, id);
                }
            }
        }

        public static MvcHtmlString WriteNode(DocumentSiteMapViewModel document, string id)
        {
            var output = new List<MvcHtmlString>();

            output.Add(new MvcHtmlString("<li><span class=\"glyphicon glyphicon-file\"></span> "));

            if(id != document.ID)
                output.Add(new MvcHtmlString("<a class=\"document\" href=\"" + document.Location + "\" data-moveid=\"" + id + "\" data-documentid=\"" + document.ID + "\">" + document.Title + "</a>"));
            else
                output.Add(new MvcHtmlString(document.Title));

            if (document.Children != null && document.Children.Count > 0)
            {
                output.Add(new MvcHtmlString("<ul>"));

                foreach (var child in document.Children)
                {
                    output.Add(WriteNode(child, id));
                }

                output.Add(new MvcHtmlString("</ul>"));
            }

            output.Add(new MvcHtmlString("</li>"));

            return new MvcHtmlString(string.Join("", output));
        }

        public static string AddCodeHintClasses(string content)
        {
            var html = new HtmlDocument();
            html.LoadHtml(content);

            var codeHintComments = html.DocumentNode.SelectNodes("//comment()[contains(., 'language:')]");

            if (codeHintComments != null)
            {
                foreach (var comment in codeHintComments)
                {
                    var sibling = comment.NextSibling;

                    if (sibling.NodeType == HtmlNodeType.Element && sibling.Name == "pre")
                    {
                        sibling.Attributes.Add("class", "prettyprint " + ParseCodeHintComment(comment.InnerText));
                    }
                    else
                    {
                        sibling = sibling.NextSibling;

                        if (sibling.NodeType == HtmlNodeType.Element && sibling.Name == "pre")
                        {
                            sibling.Attributes.Add("class", "prettyprint " + ParseCodeHintComment(comment.InnerText));
                        }
                    }
                }
            }

            var remainingPreElements = html.DocumentNode.SelectNodes("//pre[not(@class)]");

            if (remainingPreElements != null)
            {
                foreach (var pre in remainingPreElements)
                {
                    pre.Attributes.Add("class", "prettyprint");
                }
            }

            return html.DocumentNode.InnerHtml.ToString();
        }

        private static string ParseCodeHintComment(string content)
        {
            return content.Trim(new char[] { '<', '>', '-', '!', ' ' }).Split(':')[1].Trim();
        }
    }
}