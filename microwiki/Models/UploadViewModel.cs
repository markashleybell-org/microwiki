using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Http;
using MicroWiki.Domain;
using static MicroWiki.Domain.Constants;

namespace MicroWiki.Models
{
    public class UploadViewModel : ViewModelBase
    {
        [Display(Name = "Click 'Browse' to select a file")]
        public IFormFile UploadedFile { get; set; }

        public string UploadedFileName { get; set; }

        public IEnumerable<string> Files { get; set; }
            = Enumerable.Empty<string>();

        public override BreadcrumbTrailViewModel BreadcrumbTrailViewModel =>
            new BreadcrumbTrailViewModel {
                Segments = new[] {
                    new BreadcrumbTrailSegment("Home", SiteRootUrl),
                    new BreadcrumbTrailSegment("Upload")
                }
            };
    }
}
