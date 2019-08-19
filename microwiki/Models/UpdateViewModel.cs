using System;
using System.ComponentModel.DataAnnotations;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class UpdateViewModel
    {
        [Required]
        public Guid ID { get; set; }

        [Required]
        public Guid ParentID { get; set; }

        [Required]
        public string Title { get; set; }

        public string Body { get; set; }

        [Display(Name="Url")]
        public string Slug { get; set; }

        [Display(Name="Table Of Contents")]
        public bool IsTableOfContents { get; set; }

        public bool IsRootDocument { get; set; }

        public static UpdateViewModel From(Document document) =>
            new UpdateViewModel {
                ID = document.ID,
                IsRootDocument = document.ID != document.ParentID,
                Title = document.Title,
                Body = document.Body,
                IsTableOfContents = document.TOC,
                Slug = document.Slug
            };
    }
}
