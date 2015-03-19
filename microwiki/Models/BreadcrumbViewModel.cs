using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace microwiki.Models
{
    public class BreadcrumbViewModel
    {
        public List<Tuple<string, string>> Links { get; set; }
    }
}