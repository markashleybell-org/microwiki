using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MicroWiki.Abstract
{
    public interface IFileManager
    {
        Task<Uri> UploadFile(IFormFile file, string destinationPath);

        void DeleteFile(string path);

        IEnumerable<Uri> GetFiles();
    }
}
