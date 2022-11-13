using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using MicroWiki.Domain;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Models
{
    public class UpdateViewModel : ViewModelBase
    {
        public UpdateViewModel()
            : base("Edit")
        {
        }

        [Required]
        public Guid ID { get; set; }

        public Guid? ParentID { get; set; }

        [Required]
        public string Title { get; set; }

        public string Tags { get; set; }

        public string Body { get; set; }

        public string Slug { get; set; }

        public bool IsRootDocument { get; set; }

        public bool IsPublic { get; set; }

        public IEnumerable<Tag> AllTags { get; set; }

        public MarkdownEditorViewModel MarkdownEditorData =>
            new() { Title = Title };

        public string TagDataJson =>
            AllTags?.AsTagJson(t => t.Label);

        public string FilenamePrefix =>
            ID.ToString();

        public static UpdateViewModel From(Document document, IEnumerable<Tag> allTags) =>
            new() {
                ID = document.ID,
                ParentID = document.ParentID,
                IsRootDocument = !document.ParentID.HasValue,
                Title = document.Title,
                Body = document.Body,
                Tags = string.Join("|", document.Tags.Select(t => t.Label)),
                Slug = document.Slug,
                AllTags = allTags,
                IsPublic = document.IsPublic
            };

        public static Document ToDocument(UpdateViewModel model) =>
            new(
                model.ID,
                model.ParentID,
                model.Title,
                model.Body,
                CreateSlug(string.IsNullOrWhiteSpace(model.Slug) ? model.Title : model.Slug),
                TagList(model.Tags),
                model.IsPublic
            );
    }
}
