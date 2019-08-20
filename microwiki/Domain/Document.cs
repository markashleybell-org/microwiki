using System;
using System.Collections.Generic;
using System.Linq;

namespace MicroWiki.Domain
{
    public class Document
    {
        public Document(
            Guid id,
            Guid? parentID,
            string title,
            string body,
            string slug,
            bool toc,
            string username)
            : this(
                  id,
                  parentID,
                  title,
                  body,
                  slug,
                  default,
                  toc,
                  username,
                  default,
                  default)
        {
        }

        public Document(
            Guid id,
            Guid? parentID,
            string title,
            string body,
            string slug,
            string location,
            bool toc,
            string username,
            DateTime created,
            DateTime updated)
            : this(
                  id,
                  parentID,
                  title,
                  body,
                  slug,
                  location,
                  toc,
                  username,
                  created,
                  updated,
                  null)
        {
        }

        private Document(
            Guid id,
            Guid? parentID,
            string title,
            string body,
            string slug,
            string location,
            bool toc,
            string username,
            DateTime created,
            DateTime updated,
            IEnumerable<ChildDocument> children)
        {
            ID = id;
            ParentID = parentID;
            Title = title;
            Body = body;
            Slug = slug;
            Location = location;
            TOC = toc;
            Username = username;
            Created = created;
            Updated = updated;
            Children = children ?? Enumerable.Empty<ChildDocument>();
        }

        public Guid ID { get; }

        public Guid? ParentID { get; }

        public string Title { get; }

        public string Body { get; }

        public string Slug { get; }

        public string Location { get; }

        public bool TOC { get; }

        public string Username { get; }

        public DateTime Created { get; }

        public DateTime Updated { get; }

        public IEnumerable<ChildDocument> Children { get; }

        public Document WithChildren(IEnumerable<ChildDocument> children) =>
            new Document(
                ID,
                ParentID,
                Title,
                Body,
                Slug,
                Location,
                TOC,
                Username,
                Created,
                Updated,
                children
            );
    }
}
