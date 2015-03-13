using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace microwiki.Models
{
    public class DocumentViewModel
    {
        public string ID { get; set; }
        public string ParentID { get; set; }
        public string Location { get; set; }
        public string Username { get; set; }
        public string Body { get; set; }

        public List<DocumentViewModel> Children { get; set; }

        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime? Deleted { get; set; }
    }
}