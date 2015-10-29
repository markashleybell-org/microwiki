using System.ComponentModel.DataAnnotations;

namespace microwiki.Models
{
    public class DocumentUpdateViewModel
    {
        [Required]
        public string ID { get; set; }
        [Required]
        public string ParentID { get; set; }
        [Required]
        public string Title { get; set; }
        public string Body { get; set; }
        [Display(Name="Url")]
        public string Slug { get; set; }
        [Display(Name="Table Of Contents")]
        public bool TOC { get; set; }

        public bool IsRoot { get; set; }
    }
}