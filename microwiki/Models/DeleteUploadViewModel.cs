using System.Collections.Generic;
using MicroWiki.Domain;
using static MicroWiki.Domain.Constants;

namespace MicroWiki.Models
{
    public class DeleteUploadViewModel : ViewModelBase
    {
        public string Location { get; set; }

        public IEnumerable<SiteMapDocument> InUseByDocuments { get; set; }

        public override BreadcrumbTrailViewModel BreadcrumbTrailViewModel =>
            new BreadcrumbTrailViewModel {
                Segments = new[] {
                    new BreadcrumbTrailSegment("Home", SiteRootUrl),
                    new BreadcrumbTrailSegment("Delete Upload")
                }
            };
    }
}
