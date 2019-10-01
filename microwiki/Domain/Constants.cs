using Markdig;

namespace MicroWiki.Domain
{
    public static class Constants
    {
        public const string SiteRootUrl = "/";

        public static readonly MarkdownPipeline MarkdownFeatures =
            new MarkdownPipelineBuilder()
                .UseAutoLinks()
                .UsePipeTables()
                .Build();
    }
}
