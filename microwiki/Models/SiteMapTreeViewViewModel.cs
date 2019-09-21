using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MicroWiki.Models
{
    public class SiteMapTreeViewViewModel
    {
        public Guid ID { get; set; }

        public SiteMapDocumentViewModel Root { get; set; }
    }
}
