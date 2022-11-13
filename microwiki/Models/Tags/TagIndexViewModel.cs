using System.Collections.Generic;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class TagIndexViewModel : ViewModelBase
    {
        public TagIndexViewModel()
            : base("All Tags")
        {
        }

        public IEnumerable<Tag> Tags { get; set; }

        public string GetClass(Tag tag)
        {
            if (tag.UseCount >= 20)
            {
                return "badge-tag-xl";
            }

            if (tag.UseCount >= 15)
            {
                return "badge-tag-lg";
            }

            if (tag.UseCount >= 10)
            {
                return "badge-tag-md";
            }

#pragma warning disable IDE0046 // Convert to conditional expression
            if (tag.UseCount >= 5)
#pragma warning restore IDE0046 // Convert to conditional expression
            {
                return "badge-tag-sm";
            }

            return "badge-tag-xs";
        }
    }
}
