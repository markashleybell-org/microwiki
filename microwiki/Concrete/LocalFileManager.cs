using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Support;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Concrete
{
    public class LocalFileManager : IFileManager
    {
        private readonly Settings _cfg;

        private readonly string _webRootPath;
        private readonly string _fileLibraryPhysicalPath;
        private readonly string _fileLibraryRelativePath;

        public LocalFileManager(
            IWebHostEnvironment hostingEnvironment,
            IOptionsMonitor<Settings> optionsMonitor)
        {
            _cfg = optionsMonitor.CurrentValue;

            _webRootPath = hostingEnvironment.WebRootPath;

            _fileLibraryRelativePath = NormalisePhysicalPath(_cfg.LocalFileManagerLibraryFolderPath);

            _fileLibraryPhysicalPath = CreatePhysicalPath(_webRootPath, _fileLibraryRelativePath);
        }

        public async Task<Uri> UploadFile(IFormFile file, string destinationPath)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(file));
            }

            if (file.Length == 0)
            {
                throw new ArgumentOutOfRangeException(nameof(file), "File has zero length.");
            }

            var normalisedDestinationPath = NormalisePhysicalPath(destinationPath);

            var destinationFolder = Path.GetDirectoryName(normalisedDestinationPath);

            var physicalDestinationFolder = CreatePhysicalPath(_fileLibraryPhysicalPath, destinationFolder);

            if (destinationFolder != string.Empty)
            {
                Directory.CreateDirectory(physicalDestinationFolder);
            }

            var destinationFilenameOriginal = Path.GetFileName(normalisedDestinationPath);

            var destinationFilename = File.Exists(CreatePhysicalPath(physicalDestinationFolder, destinationFilenameOriginal))
                ? $"{Path.GetFileNameWithoutExtension(destinationFilenameOriginal)}-{GetUniqueCode()}{Path.GetExtension(destinationFilenameOriginal)}"
                : destinationFilenameOriginal;

            using (var stream = new FileStream(CreatePhysicalPath(physicalDestinationFolder, destinationFilename), FileMode.CreateNew))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = UrlSeparator + CreateUrlPath(_fileLibraryRelativePath, Path.GetDirectoryName(destinationPath), destinationFilename);

            return new Uri(relativeUrl, uriKind: UriKind.Relative);
        }

        public void DeleteFile(string path)
        {
            var filePath = CreatePhysicalPath(_webRootPath, path);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public IEnumerable<Uri> GetFiles() =>
            Directory.EnumerateFiles(_fileLibraryPhysicalPath, "*.*", new EnumerationOptions { RecurseSubdirectories = true })
                .Select(f => new Uri(UrlSeparator + CreateUrlPath(_fileLibraryRelativePath, f.Replace(_fileLibraryPhysicalPath, string.Empty)), uriKind: UriKind.Relative));
    }
}
