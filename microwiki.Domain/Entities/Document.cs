using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace microwiki.Domain.Entities
{
    public class Document 
    {
        public int DocumentID { get; set; }
        public string Title { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastEdited { get; set; }
        public string Body { get; set; }
    }
}
