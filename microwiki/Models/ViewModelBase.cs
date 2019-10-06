using MicroWiki.Domain;
using static MicroWiki.Domain.Constants;

namespace MicroWiki.Models
{
    public abstract class ViewModelBase
    {
        private readonly string _breadcrumbLabel;

        public ViewModelBase(string breadcrumbLabel) =>
            _breadcrumbLabel = breadcrumbLabel;

        public virtual BreadcrumbTrailViewModel BreadcrumbTrailViewModel =>
            new BreadcrumbTrailViewModel {
                Segments = new[] {
                    new BreadcrumbTrailSegment(SiteRootLabel, SiteRootUrl),
                    new BreadcrumbTrailSegment(_breadcrumbLabel)
                }
            };
    }
}
