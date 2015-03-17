using System;
using System.Collections.Generic;

namespace microwiki.Models
{
    public class DocumentSearchViewModel
    {
        public string Query { get; set; }
        public List<DocumentReadViewModel> Results { get; set; }
    }
}