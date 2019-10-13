using System;
using System.Collections.Generic;
using System.Linq;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class TagMergeViewModel : ViewModelBase
    {
        public TagMergeViewModel()
            : base("Tag Manager")
        {
        }

        public IEnumerable<Tag> Tags { get; set; }

        public Guid TagID { get; set; }

        public string MergeTagIDs { get; set; }

        public IEnumerable<Guid> TagIDsToMerge =>
            !string.IsNullOrWhiteSpace(MergeTagIDs)
                ? MergeTagIDs.Split('|', StringSplitOptions.RemoveEmptyEntries).Select(id => Guid.Parse(id))
                : Enumerable.Empty<Guid>();
    }
}
