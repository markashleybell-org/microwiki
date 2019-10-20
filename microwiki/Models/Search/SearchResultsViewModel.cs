using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
