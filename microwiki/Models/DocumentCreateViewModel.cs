﻿using System.ComponentModel.DataAnnotations;

namespace microwiki.Models
{
    public class DocumentCreateViewModel
    {
        [Required]
        public string ParentID { get; set; }
        [Required]
        public string Title { get; set; }
        public string Body { get; set; }

        public string Slug { get; set; }
    }
}