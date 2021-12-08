using System.Collections.Generic;
using System.Threading.Tasks;
using Flurl;
using Microsoft.AspNetCore.Http;

namespace MicroWiki.Abstract
{
    public interface IFileManager
    {
        Task<Url> UploadFile(IFormFile file, Url destination);

        Url DeleteFile(Url url);

        IEnumerable<Url> GetFiles();
    }
}
