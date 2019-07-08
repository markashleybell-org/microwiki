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

        public Guid ID { get; set; }

        public Guid ParentID { get; set; }

        public string Title { get; set; }

        public string Location { get; set; }
    }
}
