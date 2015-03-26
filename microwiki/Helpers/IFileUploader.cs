using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace microwiki.Helpers
{
    public interface IFileUploader
    {
        string UploadFile(HttpPostedFileBase file, string destinationFolder, string destinationFileName);
    }
}