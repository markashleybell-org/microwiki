using System;
using System.ComponentModel.DataAnnotations;
using MicroWiki.Domain;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Models
{
    public class UpdateViewModel
    {
        [Required]
        public Guid ID { get; set; }

        public Guid? ParentID { get; set; }

        [Required]
        public string Title { get; set; }

        public string Body { get; set; }

        public string Slug { get; set; }

        public bool IsTableOfContents { get; set; }

        public bool IsRootDocument { get; set; }

        public static UpdateViewModel From(Document document) =>
            new UpdateViewModel {
                ID = document.ID,
                ParentID = document.ParentID,
                IsRootDocument = !document.ParentID.HasValue,
                Title = document.Title,
                Body = document.Body,
                IsTableOfContents = document.TOC,
                Slug = document.Slug
            };

        public static Document ToDocument(UpdateViewModel model) =>
            new Document(
                model.ID,
                model.ParentID,
                model.Title,
                model.Body,
                CreateSlug(model.Slug),
                model.IsTableOfContents
            );
    }
}
