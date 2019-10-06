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
        private readonly BreadcrumbTrailViewModel _breadcrumbTrailViewModel;

        public ReadViewModel() =>
            _breadcrumbTrailViewModel = new BreadcrumbTrailViewModel();

        public ReadViewModel(BreadcrumbTrailViewModel breadcrumbTrailViewModel) =>
            _breadcrumbTrailViewModel = breadcrumbTrailViewModel;

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

        public override BreadcrumbTrailViewModel BreadcrumbTrailViewModel =>
            _breadcrumbTrailViewModel;

        public static ReadViewModel From(Document document, BreadcrumbTrailViewModel breadcrumbTrailViewModel) =>
            new ReadViewModel(breadcrumbTrailViewModel) {
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
