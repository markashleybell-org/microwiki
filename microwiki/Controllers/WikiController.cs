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

            if (document == null)
            {
                return NotFound();
            }

            var model = UpdateViewModel.From(document);

            return View(model);
        }

        [HttpPost]
        // [ValidateInput(false)]
        public async Task<IActionResult> Update(UpdateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            /*

            var sql = "EXEC mw_Update_Document @ID, @ParentID, @Title, @Body, @Slug, @Username, @TOC";

            var data = new {
                ID = model.ID,
                ParentID = model.ParentID,
                Title = model.Title,
                Body = model.Body,
                Slug = CreateSlug(model.Slug),
                Username = User.Identity.Name,
                TOC = model.TOC
            };

            using (_db = new SqlConnection(_connString))
            {
                _db.Open();
                var location = _db.ExecuteScalar<string>(sql, data);

                return Redirect(location);
            }

            */

            return View(model);
        }
    }
}
