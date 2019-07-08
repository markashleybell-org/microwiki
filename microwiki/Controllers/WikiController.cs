using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MicroWiki.Abstract;
using MicroWiki.Models;

namespace MicroWiki.Controllers
{
    public class WikiController : Controller
    {
        private readonly IRepository _repository;

        public WikiController(
            IRepository repository) =>
            _repository = repository;

        public async Task<IActionResult> Read(string location)
        {
            var document = await _repository.ReadDocument(location);

            return document != null
                ? (IActionResult)View(ReadViewModel.From(document))
                : NotFound();
        }
    }
}
