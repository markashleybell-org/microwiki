using HtmlAgilityPack;
using microwiki.Models;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace microwiki.Helpers
{
    public static class WikiHelpers
    {
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

        public static void BuildNode(List<DocumentSiteMapViewModel> documents, DocumentSiteMapViewModel document)
        {
            foreach (var d in documents)
            {
                if (d.ParentID == document.ID)
                {
                    if (document.Children == null)
                        document.Children = new List<DocumentSiteMapViewModel>();

                    document.Children.Add(d);

                    BuildNode(documents, d);
                }
            }
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