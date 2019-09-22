using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MicroWiki.Abstract
{
    public interface IFileManager
    {
        Task<string> UploadFile(IFormFile file);

        void DeleteFile(string fileName);

        IEnumerable<string> GetFiles();
    }
}
