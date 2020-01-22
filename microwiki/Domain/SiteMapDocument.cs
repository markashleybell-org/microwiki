using System;

namespace MicroWiki.Domain
{
    public class SiteMapDocument
    {
        public SiteMapDocument(
            Guid id,
            Guid? parentID,
            string title,
            string location,
            bool isPublic)
        {
            ID = id;
            ParentID = parentID;
            Title = title;
            Location = location;
            IsPublic = isPublic;
        }

        public Guid ID { get; }

        public Guid? ParentID { get; }

        public string Title { get; }

        public string Location { get; }

        public bool IsPublic { get; }
    }
}
