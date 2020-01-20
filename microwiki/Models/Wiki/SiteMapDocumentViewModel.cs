using System;
using System.Collections.Generic;
using System.Linq;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class SiteMapDocumentViewModel
    {
        public SiteMapDocumentViewModel(
            Guid id,
            Guid? parentID,
            string title,
            string location,
            bool isPublic)
            : this(
                  id,
                  parentID,
                  title,
                  location,
                  null,
                  isPublic)
        {
        }

        public SiteMapDocumentViewModel(
            Guid id,
            Guid? parentID,
            string title,
            string location,
            IEnumerable<SiteMapDocumentViewModel> children,
            bool isPublic)
        {
            ID = id;
            ParentID = parentID;
            Title = title;
            Location = location;
            Children = children ?? Enumerable.Empty<SiteMapDocumentViewModel>();
            IsPublic = isPublic;
        }

        public Guid ID { get; }

        public Guid? ParentID { get; }

        public string Location { get; }

        public string Title { get; }

        public IEnumerable<SiteMapDocumentViewModel> Children { get; }

        public bool IsPublic { get; }

        public static SiteMapDocumentViewModel From(SiteMapDocument document) =>
            new SiteMapDocumentViewModel(
                document.ID,
                document.ParentID,
                document.Title,
                document.Location,
                document.IsPublic
            );

        public SiteMapDocumentViewModel WithChildren(IEnumerable<SiteMapDocumentViewModel> children) =>
            new SiteMapDocumentViewModel(
                ID,
                ParentID,
                Title,
                Location,
                children,
                IsPublic
            );
    }
}
