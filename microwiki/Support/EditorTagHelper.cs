using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using MicroWiki.Domain;

namespace MicroWiki.Support
{
    public class EditorTagHelper : TagHelper
    {
        private const string ForAttributeName = "asp-for";

        private readonly IHtmlGenerator _htmlGenerator;

        public EditorTagHelper(IHtmlGenerator htmlGenerator) =>
            _htmlGenerator = htmlGenerator;

        [HtmlAttributeName(ForAttributeName)]
        public ModelExpression For { get; set; }

        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";
            output.Attributes.Add("class", "editor");

            var buttonData = new (string format, string label)[] {
                ("bold", "Bold"),
                ("italic", "Italic"),
                ("code", "Code"),
                ("h2", "H2"),
                ("h3", "H3"),
                ("ul", "List"),
                ("ol", "Numbered List"),
                ("link", "Link"),
                ("image", "Image")
            };

            var buttons = CreateFormatButtons(buttonData);

            var textArea = _htmlGenerator.GenerateTextArea(
                viewContext: ViewContext,
                modelExplorer: For.ModelExplorer,
                expression: For.Name,
                rows: 10,
                columns: 80,
                htmlAttributes: new { @class = "form-control" }
            );

            var tabData = new (string id, string label, bool selected, IHtmlContent[] content)[] {
                ("edit", "Edit", true, new[] { buttons, textArea }),
                ("preview", "Preview", false, new[] { new StringHtmlContent("DOCUMENT PREVIEW") })
            };

            var tabs = tabData.Select(t => (t.id, t.label, t.selected));

            output.Content.AppendHtml(CreateTabs(tabs));

            var tabPanes = tabData.Select(t => (t.id, t.selected, t.content));

            output.Content.AppendHtml(CreateTabPanes(tabPanes));

            output.TagMode = TagMode.StartTagAndEndTag;
        }

        private TagBuilder CreateTabs(IEnumerable<(string id, string label, bool selected)> tabs)
        {
            var ul = new TagBuilder("ul");

            ul.AddCssClass("nav nav-tabs");

            ul.Attributes.Add("role", "tablist");

            foreach (var (id, label, selected) in tabs)
            {
                ul.InnerHtml.AppendHtml(CreateTab(id, label, selected));
            }

            return ul;
        }

        private TagBuilder CreateTab(string id, string label, bool selected)
        {
            var li = new TagBuilder("li");

            li.AddCssClass("nav-item");

            var a = new TagBuilder("a");

            a.AddCssClass("nav-link");

            if (selected)
            {
                a.AddCssClass("active");
            }

            a.Attributes.Add("id", id + "-tab");
            a.Attributes.Add("data-toggle", "tab");
            a.Attributes.Add("href", "#" + id);
            a.Attributes.Add("role", "tab");
            a.Attributes.Add("aria-controls", id);
            a.Attributes.Add("aria-selected", selected.ToString().ToLowerInvariant());

            a.InnerHtml.Append(label);

            li.InnerHtml.AppendHtml(a);

            return li;
        }

        private TagBuilder CreateTabPanes(IEnumerable<(string id, bool selected, IHtmlContent[] content)> tabs)
        {
            var div = new TagBuilder("div");

            div.AddCssClass("tab-content");

            foreach (var (id, selected, content) in tabs)
            {
                div.InnerHtml.AppendHtml(CreateTabPane(id, selected, content));
            }

            return div;
        }

        private TagBuilder CreateTabPane(string id, bool selected, IHtmlContent[] content)
        {
            var div = new TagBuilder("div");

            div.AddCssClass("tab-pane");

            if (selected)
            {
                div.AddCssClass("show active");
            }

            div.Attributes.Add("id", id);
            div.Attributes.Add("role", "tabpanel");
            div.Attributes.Add("aria-labelledby", id + "-tab");

            foreach (var item in content)
            {
                div.InnerHtml.AppendHtml(item);
            }

            return div;
        }

        private TagBuilder CreateFormatButtons(IEnumerable<(string format, string label)> buttons)
        {
            var div = new TagBuilder("div");

            div.AddCssClass("body-editor-buttons");

            foreach (var (format, label) in buttons)
            {
                div.InnerHtml.AppendHtml(CreateFormatButton(format, label));
            }

            return div;
        }

        private TagBuilder CreateFormatButton(string format, string label)
        {
            var a = new TagBuilder("a");

            a.AddCssClass("btn btn-sm btn-info cm-format-button");

            a.Attributes.Add("data-format", format);
            a.Attributes.Add("href", "#");

            a.InnerHtml.Append(label);

            return a;
        }
    }
}
