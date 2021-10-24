using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWiki.Abstract;
using MicroWiki.Domain;
using MicroWiki.Models;

namespace MicroWiki.Controllers
{
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        private readonly IRepository _repository;

        public SearchController(
            ISearchService searchService,
            IRepository repository)
        {
            _searchService = searchService;
            _repository = repository;
        }

        public IActionResult Index(string query)
        {
            var results = !string.IsNullOrWhiteSpace(query)
                ? _searchService.Search(query, publicOnly: !User.Identity.IsAuthenticated)
                : Enumerable.Empty<SearchResult>();

            var model = new SearchResultsViewModel {
                Query = query,
                SearchResults = results
            };

            return View(model);
        }

        // https://localhost:5001/search/recreateindex
        // TODO: Remove and integrate into UI
        public async Task<IActionResult> RecreateIndex()
        {
            var documents = await _repository.ReadDocumentsForSearchIndex();

            _searchService.DeleteAndRebuildIndex(documents);

            return Ok("OK");
        }
    }
}
