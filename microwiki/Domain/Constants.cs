using Markdig;
using Markdig.Extensions.EmphasisExtras;

namespace MicroWiki.Domain
{
    public static class Constants
    {
        public const string SiteRootUrl = "/";

        public const string SiteRootLabel = "Home";

        public const string InlineButtonBaseClasses = "btn";

        public const string BlockButtonBaseClasses = "btn btn-block";

        public const string ActionButtonClasses = BlockButtonBaseClasses + " btn-sm btn-info";

        public const string DeleteButtonClasses = BlockButtonBaseClasses + " btn-sm btn-outline-danger";

        public const string StandardButtonClasses = BlockButtonBaseClasses + " btn-info";

        public const string SaveButtonClasses = "btn btn-lg btn-success";

        public const string ContentColumnClasses = "col-sm-9";

        public const string ActionColumnClasses = "col-sm-2 offset-sm-1 col-actions";

        public static readonly MarkdownPipeline MarkdownFeatures =
            new MarkdownPipelineBuilder()
                .UseEmphasisExtras(EmphasisExtraOptions.Strikethrough)
                .UseAutoLinks()
                .UsePipeTables()
                .Build();
    }
}
