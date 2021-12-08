using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Flurl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Models;
using MicroWiki.Support;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Controllers
{
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly Settings _cfg;
        private readonly IRepository _repository;
        private readonly IFileManager _fileManager;

        public FilesController(
            IOptionsMonitor<Settings> optionsMonitor,
            IRepository repository,
            IFileManager fileManager)
        {
            _cfg = optionsMonitor.CurrentValue;
            _repository = repository;
            _fileManager = fileManager;
        }

        public IActionResult Index()
        {
            var model = new FileListViewModel {
                FileUrls = _fileManager.GetFiles()
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Upload(UploadViewModel model)
        {
            var file = model.UploadedFile;

            if (file == null)
            {
                return RedirectToAction(nameof(Upload));
            }

            var uploadedFilePath = await _fileManager.UploadFile(file, $"{model.FileNamePrefix}/{file.FileName}");

            var data = new {
                Filename = Path.GetFileNameWithoutExtension(file.FileName),
                Extension = Path.GetExtension(file.FileName).Trim('.'),
                Url = uploadedFilePath.ToString()
            };

            return Json(data);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteUpload(DeleteUploadViewModel model)
        {
            var fileUrl = new Url(NormaliseUrlPath(model.Url));

            var usedInLocations = await _repository.CheckFileUse(fileUrl);

            if (usedInLocations.Any())
            {
                model.InUseByDocuments = usedInLocations;

                return View(model);
            }

            _fileManager.DeleteFile(fileUrl);

            return RedirectToAction(nameof(Index));
        }
    }
}
