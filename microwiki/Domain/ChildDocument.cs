using System;

namespace MicroWiki.Domain
{
    public class ChildDocument
    {
        public ChildDocument(
            Guid id,
            Guid parentID,
            string title,
            string location)
        {
            ID = id;
            ParentID = parentID;
            Title = title;
            Location = location;
        }

        public Guid ID { get; }

        public Guid ParentID { get; }

        public string Title { get; }

        public string Location { get; }
    }
}
