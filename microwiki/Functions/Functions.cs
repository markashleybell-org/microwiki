using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Html;
using MicroWiki.Domain;
using MicroWiki.Models;

namespace MicroWiki.Functions
{
    public static class Functions
    {
        public static string GetUniqueCode()
        {
            var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var ticks = DateTime.UtcNow.Ticks.ToString();

            var code = string.Empty;

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
                    {
                        code += characters[number];
                    }
                }
            }

            return code;
        }

        public static string CreateSlug(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return null;
            }

            var options = RegexOptions.IgnoreCase | RegexOptions.Singleline;

            // Remove all special chars (but not spaces or dashes)
            var output = Regex.Replace(input, @"[^a-z0-9\s\-]", string.Empty, options);

            // Replace spaces with hyphens
            output = Regex.Replace(output, @"[\s]", "-", options);

            // Replace multiple hyphens (more than one in a row) with a single hyphen
            output = Regex.Replace(output, @"\-{2,}", "-", options);

            // Trim extra hyphen off the end if exists
            if (output.EndsWith("-"))
            {
                output = output.Substring(0, output.Length - 1);
            }

            return output.ToLower();
        }

        public static SiteMapDocumentViewModel AsTree(
            this SiteMapDocument document,
            IEnumerable<SiteMapDocument> documents)
        {
            var children = documents.Where(d => d.ParentID == document.ID)
                .Select(c => c.AsTree(documents));

            return SiteMapDocumentViewModel.From(document).WithChildren(children);
        }

        public static HtmlString GetTreeHtml(SiteMapDocumentViewModel document, Guid id)
        {
            var output = new List<HtmlString> {
                new HtmlString("<li><span class=\"glyphicon glyphicon-file\"></span> ")
            };

            if (id != document.ID)
            {
                output.Add(new HtmlString("<a class=\"document\" href=\"" + document.Location + "\" data-moveid=\"" + id + "\" data-documentid=\"" + document.ID + "\">" + document.Title + "</a>"));
            }
            else
            {
                output.Add(new HtmlString(document.Title));
            }

            if (document.Children.Any())
            {
                output.Add(new HtmlString("<ul>"));

                foreach (var child in document.Children)
                {
                    output.Add(GetTreeHtml(child, id));
                }

                output.Add(new HtmlString("</ul>"));
            }

            output.Add(new HtmlString("</li>"));

            return new HtmlString(string.Join(string.Empty, output));
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
                        var lang = ParseCodeHintComment(comment.InnerText);

                        if (lang == "lang-none")
                        {
                            sibling.Attributes.Add("class", "lang-none");
                        }
                        else
                        {
                            sibling.Attributes.Add("class", "prettyprint " + lang);
                        }
                    }
                    else
                    {
                        sibling = sibling.NextSibling;

                        if (sibling.NodeType == HtmlNodeType.Element && sibling.Name == "pre")
                        {
                            var lang = ParseCodeHintComment(comment.InnerText);

                            if (lang == "lang-none")
                            {
                                sibling.Attributes.Add("class", "lang-none");
                            }
                            else
                            {
                                sibling.Attributes.Add("class", "prettyprint " + lang);
                            }
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
            var lang = content.Trim(new char[] { '<', '>', '-', '!', ' ' }).Split(':')[1].Trim();

            return !lang.StartsWith("lang-") ? "lang-" + lang : lang;
        }
    }
}
