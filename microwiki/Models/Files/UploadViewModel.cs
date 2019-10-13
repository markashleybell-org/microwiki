using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace MicroWiki.Models
{
    public class UploadViewModel : ViewModelBase
    {
        public UploadViewModel()
            : base("Uploads")
        {
        }

        [Display(Name = "Click 'Browse' to select a file")]
        public IFormFile UploadedFile { get; set; }

        public string UploadedFileName { get; set; }

        public IEnumerable<string> Files { get; set; }
            = Enumerable.Empty<string>();
    }
}
