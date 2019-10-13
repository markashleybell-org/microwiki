using System;

namespace MicroWiki.Models
{
    public class MoveDocumentModalViewModel
    {
        public Guid ID { get; set; }

        public string Title { get; set; }

        public SiteMapDocumentViewModel Root { get; set; }
    }
}
