using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Flurl;
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

        public async Task<Url> UploadFile(IFormFile file, Url destination)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(file));
            }

            if (file.Length == 0)
            {
                throw new ArgumentOutOfRangeException(nameof(file), "File has zero length.");
            }

            var normalisedDestinationPath = NormalisePhysicalPath(TrimSeparators(destination.ToString()));

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

            return _fileLibraryFolderRelativeUrl.AppendPathSegments(destinationFolder, destinationFilename);
        }

        public Url DeleteFile(Url url)
        {
            url.PathSegments.Remove(_fileLibraryFolderRelativeUrl.Trim('/'));

            var filePath = Path.Combine(_fileLibraryFolderPhysicalPath, NormalisePhysicalPath(TrimSeparators(Uri.UnescapeDataString(url))));

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return url;
        }

        public IEnumerable<Url> GetFiles() =>
            Directory.EnumerateFiles(_fileLibraryFolderPhysicalPath, "*.*", new EnumerationOptions { RecurseSubdirectories = true })
                .Select(f => f.Replace(_fileLibraryFolderPhysicalPath + Path.DirectorySeparatorChar, string.Empty))
                .Select(f => _fileLibraryFolderRelativeUrl.AppendPathSegment(NormaliseUrlPath(f)));
    }
}
