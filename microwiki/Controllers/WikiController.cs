using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MicroWiki.Abstract;
using MicroWiki.Models;
using static MicroWiki.Functions.Functions;

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

        [HttpGet]
        public async Task<IActionResult> Update(Guid id)
        {
            var document = await _repository.ReadDocument(id);

            return document != null
                ? (IActionResult)View(UpdateViewModel.From(document))
                : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Update(UpdateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var update = UpdateViewModel.ToDocument(model, "markb");

            var document = await _repository.UpdateDocument(update);

            return Redirect(document.Location);
        }
    }
}
