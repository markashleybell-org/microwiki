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
        private readonly Settings _cfg;

        public DebugController(
            IOptionsMonitor<Settings> optionsMonitor) =>
            _cfg = optionsMonitor.CurrentValue;

        public IActionResult Index()
        {
            var fileLibraryPhysicalPath = _cfg.LocalFileManagerLibraryFolderPhysicalPath;

            var destinationPath = "c479dd73-0699-4295-a167-a78e4919e235/flowers2.jpg";

            var normalisedDestinationPath = NormalisePhysicalPath(destinationPath);

            var destinationFolder = Path.GetDirectoryName(normalisedDestinationPath);

            var physicalDestinationFolder = Path.Combine(fileLibraryPhysicalPath, destinationFolder);

            var physicalDestinationFilename = Path.Combine(physicalDestinationFolder, Path.GetFileName(normalisedDestinationPath));

            var output = $@"
LocalFileManagerLibraryFolderPath: {_cfg.LocalFileManagerLibraryFolderPhysicalPath}

normalisedDestinationPath: {normalisedDestinationPath}

destinationFolder: {destinationFolder}

physicalDestinationFolder: {physicalDestinationFolder}

physicalDestinationFilename: {physicalDestinationFilename}
";

            return Content(output);
        }
    }
}
