using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Html;
using MicroWiki.Domain;

namespace MicroWiki.Models
{
    public class SearchResultsViewModel : ViewModelBase
    {
        public SearchResultsViewModel()
            : base("Search Results")
        {
        }

        public string Query { get; set; }

        public IEnumerable<SearchResult> SearchResults { get; set; }
            = Enumerable.Empty<SearchResult>();

        public HtmlString QueryHtmlForDisplay =>
            new HtmlString(Query?.Replace("[", "<span class=\"badge badge-primary\">").Replace("]", "</span>"));
    }
}
