using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWiki.Abstract;
using MicroWiki.Models;

namespace MicroWiki.Controllers
{
    [Authorize]
    public class TagsController : ControllerBase
    {
        private readonly IRepository _repository;

        public TagsController(IRepository repository) =>
            _repository = repository;

        public async Task<IActionResult> Index()
        {
            var model = new TagIndexViewModel {
                Tags = await _repository.GetTags()
            };

            return View(model);
        }

        public async Task<IActionResult> Manage()
        {
            var model = new TagMergeViewModel {
                Tags = await _repository.GetTags()
            };

            return View(model);
        }

        public async Task<IActionResult> Merge(TagMergeViewModel model)
        {
            await _repository.MergeTags(model.TagID, model.TagIDsToMerge);

            return RedirectToAction(nameof(Manage));
        }
    }
}
