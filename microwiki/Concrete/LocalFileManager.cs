using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
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

        private readonly string _fileLibraryFolderPhysicalPath;
        private readonly string _fileLibraryFolderRelativeUrl;

        public LocalFileManager(
            IOptionsMonitor<Settings> optionsMonitor)
        {
            _cfg = optionsMonitor.CurrentValue;

            _fileLibraryFolderPhysicalPath = _cfg.LocalFileManagerLibraryFolderPhysicalPath;
            _fileLibraryFolderRelativeUrl = _cfg.LocalFileManagerLibraryFolderRelativeUrl;
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

            var normalisedDestinationPath = NormalisePhysicalPath(TrimSeparators(destinationPath));

            var destinationFolder = Path.GetDirectoryName(normalisedDestinationPath);

            var physicalDestinationFolder = Path.Combine(_fileLibraryFolderPhysicalPath, destinationFolder);

            if (destinationFolder != string.Empty)
            {
                Directory.CreateDirectory(physicalDestinationFolder);
            }

            var destinationFilenameOriginal = Path.GetFileName(normalisedDestinationPath);

            var destinationFilename = File.Exists(Path.Combine(physicalDestinationFolder, destinationFilenameOriginal))
                ? $"{Path.GetFileNameWithoutExtension(destinationFilenameOriginal)}-{GetUniqueCode()}{Path.GetExtension(destinationFilenameOriginal)}"
                : destinationFilenameOriginal;

            using (var stream = new FileStream(Path.Combine(physicalDestinationFolder, destinationFilename), FileMode.CreateNew))
            {
                await file.CopyToAsync(stream);
            }

            var urlParts = new[] { _fileLibraryFolderRelativeUrl, destinationFolder, destinationFilename }
                .Where(s => !string.IsNullOrWhiteSpace(s));

            var relativeUrl = string.Join(UrlSeparator, urlParts);

            return new Uri(relativeUrl, uriKind: UriKind.Relative);
        }

        public void DeleteFile(string path)
        {
            var filePath = Path.Combine(_fileLibraryFolderPhysicalPath, NormalisePhysicalPath(TrimSeparators(path)));

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public IEnumerable<Uri> GetFiles() =>
            Directory.EnumerateFiles(_fileLibraryFolderPhysicalPath, "*.*", new EnumerationOptions { RecurseSubdirectories = true })
                .Select(f => new Uri(string.Join(UrlSeparator, f.Replace(_fileLibraryFolderPhysicalPath + Path.DirectorySeparatorChar, string.Empty)), uriKind: UriKind.Relative));
    }
}
