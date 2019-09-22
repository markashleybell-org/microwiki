using System.Collections.Generic;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class DeleteUploadViewModel
    {
        public string Location { get; set; }

        public IEnumerable<SiteMapDocument> InUseByDocuments { get; set; }
    }
}
