using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace microwiki.Models
{
    public class UploadViewModel
    {
        [Display(Name = "File")]
        public HttpPostedFileBase UploadedFile { get; set; }
        public string UploadedFileName { get; set; }
        public string[] Files { get; set; }
    }
}