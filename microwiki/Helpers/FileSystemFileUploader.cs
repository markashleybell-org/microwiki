using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace microwiki.Helpers
{
    public class FileSystemFileUploader : IFileUploader
    {
        public string UploadFile(HttpPostedFileBase file, string destinationFolder, string destinationFilename)
        {
            var destinationPath = destinationFolder + "\\" + Path.GetFileName(destinationFilename);

            if (System.IO.File.Exists(destinationPath))
                destinationPath = destinationFolder + "\\" + Path.GetFileNameWithoutExtension(destinationFilename) + "-" + WikiHelpers.GetUniqueCode() + Path.GetExtension(destinationFilename);

            file.SaveAs(destinationPath);

            return "/UserContent/" + Path.GetFileName(destinationPath);
        }
    }
}