using System;
using System.Collections.Generic;

namespace MicroWiki.Domain
{
    public class SearchResult
    {
        public SearchResult(
            float score,
            DateTime lastUpdate,
            Guid id,
            string title,
            string body,
            string location,
            IEnumerable<Tag> tags,
            bool isPublic,
            string[] highlights)
        {
            Score = score;
            LastUpdate = lastUpdate;
            ID = id;
            Title = title ?? throw new ArgumentNullException(nameof(title));
            Body = body ?? throw new ArgumentNullException(nameof(body));
            Location = location ?? throw new ArgumentNullException(nameof(location));
            Tags = tags ?? throw new ArgumentNullException(nameof(tags));
            IsPublic = isPublic;
            Highlights = highlights ?? Array.Empty<string>();
        }

        public float Score { get; }

        public DateTime LastUpdate { get; }

        public Guid ID { get; }

        public string Title { get; }

        public string Body { get; }

        public string Location { get; }

        public IEnumerable<Tag> Tags { get; }

        public bool IsPublic { get; }

        public string[] Highlights { get; }
    }
}
