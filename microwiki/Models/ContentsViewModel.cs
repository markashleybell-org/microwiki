namespace MicroWiki.Models
{
    public class ContentsViewModel : ViewModelBase
    {
        public ContentsViewModel()
            : base("Contents")
        {
        }

        public SiteMapDocumentViewModel Root { get; set; }
    }
}
