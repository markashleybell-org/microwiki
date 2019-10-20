using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Domain
{
    public class SearchResult
    {
        public SearchResult(
            Guid id,
            string title,
            string body,
            string location,
            string tags)
        {
            ID = id;
            Title = title;
            Body = body;
            Location = location;
            Tags = TagList(tags);
        }

        public Guid ID { get; }

        public string Title { get; }

        public string Body { get; }

        public string Location { get; }

        public IEnumerable<Tag> Tags { get; }

        public string Summary =>
            !string.IsNullOrWhiteSpace(Body) ? Body.Length > 200 ? Body.Substring(0, 200) : Body : null;
    }
}
