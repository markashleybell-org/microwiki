using MicroWiki.Domain;
using static MicroWiki.Domain.Constants;

namespace MicroWiki.Models
{
    public class ContentsViewModel : ViewModelBase
    {
        public SiteMapDocumentViewModel Root { get; set; }

        public override BreadcrumbTrailViewModel BreadcrumbTrailViewModel =>
            new BreadcrumbTrailViewModel {
                Segments = new[] {
                    new BreadcrumbTrailSegment("Home", SiteRootUrl),
                    new BreadcrumbTrailSegment("Contents")
                }
            };
    }
}
