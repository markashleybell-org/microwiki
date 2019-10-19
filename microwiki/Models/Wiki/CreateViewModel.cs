using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using MicroWiki.Domain;
using static MicroWiki.Domain.Constants;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Models
{
    public class CreateViewModel : ViewModelBase
    {
        public CreateViewModel()
            : base("Create")
        {
        }

        [Required]
        public Guid? ParentID { get; set; }

        public string ParentTitle { get; set; }

        [Required]
        public string Title { get; set; }

        public string Tags { get; set; }

        public string Body { get; set; }

        public string Slug { get; set; }

        public bool IsTableOfContents { get; set; }

        public IEnumerable<Tag> AllTags { get; set; }

        public static CreateViewModel From(Document parentDocument, IEnumerable<Tag> allTags) =>
            new CreateViewModel {
                ParentID = parentDocument.ParentID,
                ParentTitle = parentDocument.Title,
                AllTags = allTags
            };

        public static Document ToDocument(CreateViewModel model) =>
            new Document(
                Guid.NewGuid(),
                model.ParentID,
                model.Title,
                model.Body,
                CreateSlug(model.Title),
                model.IsTableOfContents,
                model.Tags
                    .Split('|', StringSplitOptions.RemoveEmptyEntries)
                    .Select(t => new Tag(t))
            );
    }
}
