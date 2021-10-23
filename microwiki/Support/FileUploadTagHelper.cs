using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using MicroWiki.Domain;

namespace MicroWiki.Support
{
    public class FileUploadTagHelper : TagHelper
    {
        private const string ActionAttributeName = "asp-action";
        private const string ControllerAttributeName = "asp-controller";

        private readonly IHtmlGenerator _htmlGenerator;

        public FileUploadTagHelper(IHtmlGenerator htmlGenerator) =>
            _htmlGenerator = htmlGenerator;

        [HtmlAttributeName(ActionAttributeName)]
        public string Action { get; set; }

        [HtmlAttributeName(ControllerAttributeName)]
        public string Controller { get; set; }

        public string FilenamePrefix { get; set; }

        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "form";

            var form = _htmlGenerator.GenerateForm(
                viewContext: ViewContext,
                actionName: Action,
                controllerName: Controller,
                routeValues: null,
                method: "post",
                htmlAttributes: new { enctype = "multipart/form-data", @class = "editor-dropzone" }
            );

            output.MergeAttributes(form);

            var notice = new TagBuilder("div");

            notice.Attributes.Add("class", "dz-message");
            notice.InnerHtml.Append("Click here or drop files to upload");

            output.Content.AppendHtml(notice);

            var field = new TagBuilder("input");

            field.Attributes.Add("type", "hidden");
            field.Attributes.Add("id", "FilenamePrefix");
            field.Attributes.Add("name", "FilenamePrefix");
            field.Attributes.Add("value", FilenamePrefix);

            output.Content.AppendHtml(field);

            var aft = _htmlGenerator.GenerateAntiforgery(ViewContext);

            output.Content.AppendHtml(aft);

            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
