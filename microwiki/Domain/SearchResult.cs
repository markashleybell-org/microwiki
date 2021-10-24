using System;
using System.Collections.Generic;

namespace MicroWiki.Domain
{
    public class SearchResult
    {
        public SearchResult(
            float score,
            Guid id,
            string title,
            string body,
            string location,
            IEnumerable<Tag> tags,
            bool isPublic)
        {
            Score = score;
            ID = id;
            Title = title ?? throw new ArgumentNullException(nameof(title));
            Body = body ?? throw new ArgumentNullException(nameof(body));
            Location = location ?? throw new ArgumentNullException(nameof(location));
            Tags = tags ?? throw new ArgumentNullException(nameof(tags));
            IsPublic = isPublic;
        }

        public float Score { get; }

        public Guid ID { get; }

        public string Title { get; }

        public string Body { get; }

        public string Location { get; }

        public IEnumerable<Tag> Tags { get; }

        public bool IsPublic { get; }
    }
}
