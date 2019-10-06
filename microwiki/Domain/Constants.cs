using Markdig;

namespace MicroWiki.Domain
{
    public static class Constants
    {
        public const string SiteRootUrl = "/";

        public const string SiteRootLabel = "Home";

        public const string ButtonBaseClasses = "btn btn-sm btn-block";

        public const string ActionButtonClasses = ButtonBaseClasses + " btn-info";

        public const string DeleteButtonClasses = ButtonBaseClasses + " btn-outline-danger";

        public const string SaveButtonClasses = "btn btn-lg btn-success";

        public static readonly MarkdownPipeline MarkdownFeatures =
            new MarkdownPipelineBuilder()
                .UseAutoLinks()
                .UsePipeTables()
                .Build();
    }
}
