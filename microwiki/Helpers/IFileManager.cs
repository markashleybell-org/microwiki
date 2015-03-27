using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace microwiki.Helpers
{
    public interface IFileManager
    {
        string UploadFile(HttpPostedFileBase file);
        void DeleteFile(string file);
        string[] GetFiles();
    }
}