using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace microwiki.Models
{
    public class WikiTreeViewModel
    {
        public string ID { get; set; }
        public DocumentSiteMapViewModel Root { get; set; }
    }
}