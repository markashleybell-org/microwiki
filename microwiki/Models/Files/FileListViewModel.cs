using System.Collections.Generic;
using System.Linq;

namespace MicroWiki.Models
{
    public class FileListViewModel : ViewModelBase
    {
        public FileListViewModel()
            : base("Uploads")
        {
        }

        public string LibraryFolderRelativeUrl { get; set; }

        public IEnumerable<string> Files { get; set; }
            = Enumerable.Empty<string>();
    }
}
