using System;
using System.Collections.Generic;
using System.Linq;
using Markdig;
using MicroWiki.Domain;
using static MicroWiki.Domain.Constants;

namespace MicroWiki.Models
{
    public class ReadViewModel : ViewModelBase
    {
        private readonly BreadcrumbTrailViewModel _breadcrumbTrailData;

        public ReadViewModel()
            : base(string.Empty) =>
            _breadcrumbTrailData = new BreadcrumbTrailViewModel();

        public ReadViewModel(BreadcrumbTrailViewModel breadcrumbTrailData)
            : base(string.Empty) =>
            _breadcrumbTrailData = breadcrumbTrailData;

        public Guid ID { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }

        public string BodyRaw { get; set; }

        public string Location { get; set; }

        public bool IsRootDocument { get; set; }

        public bool IsTableOfContents { get; set; }

        public IEnumerable<Tag> Tags { get; set; }

        public string Username { get; set; }

        public DateTime Created { get; set; }

        public DateTime Updated { get; set; }

        public IEnumerable<ChildDocumentViewModel> Children { get; set; }

        public override BreadcrumbTrailViewModel BreadcrumbTrailData =>
            _breadcrumbTrailData;

        public static ReadViewModel From(Document document, BreadcrumbTrailViewModel breadcrumbTrailData) =>
            new ReadViewModel(breadcrumbTrailData) {
                ID = document.ID,
                IsRootDocument = !document.ParentID.HasValue,
                Location = document.Location,
                Username = document.Username,
                Title = document.Title,
                Body = !string.IsNullOrWhiteSpace(document.Body)
                    ? Markdown.ToHtml(document.Body, MarkdownFeatures)
                    : default,
                BodyRaw = document.Body,
                IsTableOfContents = document.TOC,
                Tags = document.Tags,
                Created = document.Created,
                Updated = document.Updated,
                Children = document.Children.Select(c => new ChildDocumentViewModel {
                    Location = c.Location,
                    Title = c.Title
                })
            };
    }
}
