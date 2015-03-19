using System;
using System.Collections.Generic;

namespace microwiki.Models
{
    public class DocumentSiteMapViewModel
    {
        public string ID { get; set; }
        public string ParentID { get; set; }
        public string Location { get; set; }
        public string Title { get; set; }

        public List<DocumentSiteMapViewModel> Children { get; set; }
    }
}