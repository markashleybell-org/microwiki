using System;
using System.Collections.Generic;
using System.Linq;
using CommonMark;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class ReadViewModel
    {
        public Guid ID { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }

        public string BodyRaw { get; set; }

        public string Location { get; set; }

        public bool IsRootDocument { get; set; }

        public bool IsTableOfContents { get; set; }

        public string Username { get; set; }

        public DateTime Created { get; set; }

        public DateTime Updated { get; set; }

        public IEnumerable<ChildDocumentViewModel> Children { get; set; }

        public BreadcrumbTrailViewModel BreadcrumbTrailViewModel { get; set; }

        public static ReadViewModel From(Document document, BreadcrumbTrailViewModel breadcrumbTrailViewModel) =>
            new ReadViewModel {
                ID = document.ID,
                IsRootDocument = !document.ParentID.HasValue,
                Location = document.Location,
                Username = document.Username,
                Title = document.Title,
                Body = CommonMarkConverter.Convert(document.Body),
                BodyRaw = document.Body,
                IsTableOfContents = document.TOC,
                Created = document.Created,
                Updated = document.Updated,
                Children = document.Children.Select(c => new ChildDocumentViewModel {
                    Location = c.Location,
                    Title = c.Title
                }),
                BreadcrumbTrailViewModel = breadcrumbTrailViewModel
            };
    }
}
