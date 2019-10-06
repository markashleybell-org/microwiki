using System.Collections.Generic;
using System.Linq;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class BreadcrumbTrailViewModel
    {
        public IEnumerable<BreadcrumbTrailSegment> Segments { get; set; }
            = Enumerable.Empty<BreadcrumbTrailSegment>();
    }
}
