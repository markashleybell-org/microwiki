namespace MicroWiki.Support
{
    public class Settings
    {
        public string ApplicationTitle { get; set; }

        public string ConnectionString { get; set; }

        public string LocalFileManagerLibraryFolderPhysicalPath { get; set; }

        public string LocalFileManagerLibraryFolderRelativeUrl { get; set; }

        public int PersistentSessionLengthInDays { get; set; }

        public string SearchIndexBasePath { get; set; }
    }
}
