using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWiki.Abstract;
using MicroWiki.Functions;
using MicroWiki.Models;
using static MicroWiki.Domain.Constants;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Controllers
{
    [Authorize]
    public class WikiController : ControllerBase
    {
        private readonly IRepository _repository;

        public WikiController(IRepository repository) =>
            _repository = repository;

        public async Task<IActionResult> BreadcrumbTrail(Guid id)
        {
            var model = new BreadcrumbTrailViewModel {
                Segments = await _repository.GetBreadcrumbTrail(id)
            };

            return PartialView(nameof(BreadcrumbTrail), model);
        }

        [HttpGet]
        public async Task<IActionResult> Create(Guid parentID)
        {
            var parentDocument = await _repository.ReadDocument(parentID);

            if (parentDocument == null)
            {
                return NotFound();
            }

            var allTags = await _repository.GetTags();

            var model = CreateViewModel.From(parentDocument, allTags);

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                model.AllTags = await _repository.GetTags();

                return View(model);
            }

            var create = CreateViewModel.ToDocument(model);

            var document = await _repository.CreateDocument(create);

            return Redirect(document.Location);
        }

        public async Task<IActionResult> Read(string location)
        {
            var document = await _repository.ReadDocument(location);

            if (document == null)
            {
                return NotFound();
            }

            var breadcrumbTrailData = new BreadcrumbTrailViewModel {
                Segments = await _repository.GetBreadcrumbTrail(document.ID)
            };

            return View(ReadViewModel.From(document, breadcrumbTrailData));
        }

        [HttpGet]
        public async Task<IActionResult> Update(Guid id)
        {
            var document = await _repository.ReadDocument(id);

            if (document == null)
            {
                return NotFound();
            }

            var allTags = await _repository.GetTags();

            return document != null
                ? (IActionResult)View(UpdateViewModel.From(document, allTags))
                : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Update(UpdateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                model.AllTags = await _repository.GetTags();

                return View(model);
            }

            var update = UpdateViewModel.ToDocument(model);

            var document = await _repository.UpdateDocument(update);

            return Redirect(document.Location);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _repository.DeleteDocument(id);

            return Redirect(SiteRootUrl);
        }

        public async Task<IActionResult> Contents()
        {
            var model = new ContentsViewModel {
                Root = await GetSiteMap()
            };

            return View(model);
        }

        public async Task<IActionResult> EditorTestHarness(Guid? id)
        {
            var model = new EditorTestHarnessViewModel();

            if (id.HasValue)
            {
                var document = await _repository.ReadDocument(id.Value);

                model.Body = document.Body;
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Move(Guid id, Guid newParentID)
        {
            var newLocation = await _repository.MoveDocument(id, newParentID);

            return Json(new { newLocation });
        }

        public async Task<IActionResult> MoveDocumentModal(Guid currentDocumentId, string currentDocumentTitle)
        {
            var model = new MoveDocumentModalViewModel {
                ID = currentDocumentId,
                Title = currentDocumentTitle,
                Root = await GetSiteMap()
            };

            return PartialView(nameof(MoveDocumentModal), model);
        }

        private async Task<SiteMapDocumentViewModel> GetSiteMap()
        {
            var documents = await _repository.ReadAllDocuments();

            var root = documents.Single(d => !d.ParentID.HasValue);

            return root.AsTree(documents);
        }
    }
}
