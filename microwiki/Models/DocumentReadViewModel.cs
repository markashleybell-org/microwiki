using System;
using System.Collections.Generic;

namespace microwiki.Models
{
    public class DocumentReadViewModel
    {
        public string ID { get; set; }
        public string ParentID { get; set; }
        public string Location { get; set; }
        public string Username { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Slug { get; set; }
        public bool TOC { get; set; }

        public List<DocumentReadViewModel> Children { get; set; }

        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime? Deleted { get; set; }
    }
}