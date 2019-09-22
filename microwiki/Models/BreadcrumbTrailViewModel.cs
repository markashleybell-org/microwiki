using System.Collections.Generic;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class BreadcrumbTrailViewModel
    {
        public IEnumerable<BreadcrumbTrailSegment> Segments { get; set; }

        public string CurrentUrl { get; set; }
    }
}
