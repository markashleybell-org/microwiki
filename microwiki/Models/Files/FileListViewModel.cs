using System.Collections.Generic;
using System.Linq;
using Flurl;

namespace MicroWiki.Models
{
    public class FileListViewModel : ViewModelBase
    {
        public FileListViewModel()
            : base("Uploads")
        {
        }

        public IEnumerable<Url> FileUrls { get; set; }
            = Enumerable.Empty<Url>();
    }
}
