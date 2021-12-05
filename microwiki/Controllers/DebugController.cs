using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Domain;
using MicroWiki.Models;
using MicroWiki.Support;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Controllers
{
    public class DebugController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly Settings _cfg;

        public DebugController(
            IWebHostEnvironment hostingEnvironment,
            IOptionsMonitor<Settings> optionsMonitor)
        {
            _hostingEnvironment = hostingEnvironment;
            _cfg = optionsMonitor.CurrentValue;
        }

        public IActionResult Index()
        {
            var webRootPath = _hostingEnvironment.WebRootPath;

            var fileLibraryRelativePath = NormalisePhysicalPath(_cfg.LocalFileManagerLibraryFolderPath);

            var fileLibraryPhysicalPath = CreatePhysicalPath(webRootPath, fileLibraryRelativePath);

            var destinationPath = "c479dd73-0699-4295-a167-a78e4919e235/flowers2.jpg";

            var normalisedDestinationPath = NormalisePhysicalPath(destinationPath);

            var destinationFolder = Path.GetDirectoryName(normalisedDestinationPath);

            var physicalDestinationFolder = CreatePhysicalPath(fileLibraryPhysicalPath, destinationFolder);

            var output = $@"
LocalFileManagerLibraryFolderPath: {_cfg.LocalFileManagerLibraryFolderPath}

_fileLibraryRelativePath: {fileLibraryRelativePath}

_fileLibraryPhysicalPath: {fileLibraryPhysicalPath}

normalisedDestinationPath: {normalisedDestinationPath}

destinationFolder: {destinationFolder}

physicalDestinationFolder: {physicalDestinationFolder}
";

            return Content(output);
        }
    }
}
