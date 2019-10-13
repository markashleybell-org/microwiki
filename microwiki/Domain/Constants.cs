using Markdig;

namespace MicroWiki.Domain
{
    public static class Constants
    {
        public const string SiteRootUrl = "/";

        public const string SiteRootLabel = "Home";

        public const string ButtonBaseClasses = "btn btn-block";

        public const string ActionButtonClasses = ButtonBaseClasses + " btn-sm btn-info";

        public const string DeleteButtonClasses = ButtonBaseClasses + " btn-sm btn-outline-danger";

        public const string StandardButtonClasses = ButtonBaseClasses + " btn-info";

        public const string SaveButtonClasses = "btn btn-lg btn-success";

        public static readonly MarkdownPipeline MarkdownFeatures =
            new MarkdownPipelineBuilder()
                .UseAutoLinks()
                .UsePipeTables()
                .Build();
    }
}
