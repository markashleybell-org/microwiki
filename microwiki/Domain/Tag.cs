using System;
using System.Text.RegularExpressions;

namespace MicroWiki.Domain
{
    public class Tag
    {
        public Tag(string label)
            : this(default, label)
        {
        }

        public Tag(Guid? id, string label)
            : this(id, label, default)
        {
        }

        public Tag(Guid? id, string label, int? useCount)
        {
            if (label is null)
            {
                throw new ArgumentNullException(nameof(label));
            }

            if (string.IsNullOrWhiteSpace(label))
            {
                throw new ArgumentOutOfRangeException(nameof(label), "Tag labels cannot be empty");
            }

            ID = id;
            Label = Regex.Replace(label.Trim(), @"\s+", "-").ToLowerInvariant();
            UseCount = useCount ?? 0;
        }

        public Guid? ID { get; }

        public string Label { get; }

        public int UseCount { get; }
    }
}
