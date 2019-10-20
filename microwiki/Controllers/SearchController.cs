using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWiki.Abstract;
using MicroWiki.Models;

namespace MicroWiki.Controllers
{
    [Authorize]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService) =>
            _searchService = searchService;

        public async Task<IActionResult> Index(string query)
        {
            var model = new SearchResultsViewModel {
                Query = query,
                SearchResults = await _searchService.Search(query)
            };

            return View(model);
        }
    }
}
