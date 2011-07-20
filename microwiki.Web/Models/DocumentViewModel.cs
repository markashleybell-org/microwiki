using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace microwiki.Web.Models 
{
    public class DocumentViewModel 
    {
        public string ID { get; set; }
        public string Location { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastEdited { get; set; }
        public string Body { get; set; }
        public List<DocumentViewModel> Children { get; set; }
    }
}