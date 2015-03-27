using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace microwiki.Helpers
{
    public class LocalFileManager : IFileManager
    {
        private HttpContextBase _context;
        private string _imageLibraryPhysicalPath;
        private string _imageLibraryRelativePath;

        public LocalFileManager(HttpContextBase context)
        {
            _context = context;
            _imageLibraryRelativePath = ConfigurationManager.AppSettings["LocalFileManagerLibraryFolder"];
            _imageLibraryPhysicalPath = _context.Server.MapPath(_imageLibraryRelativePath);
        }

        public string UploadFile(HttpPostedFileBase file)
        {
            var destinationFile = _imageLibraryPhysicalPath + "\\" + Path.GetFileName(file.FileName);

            // If the file already exists, add a random code to the filename to avoid overwrites
            if (System.IO.File.Exists(destinationFile))
                destinationFile = _imageLibraryPhysicalPath + "\\" + Path.GetFileNameWithoutExtension(destinationFile) + "-" + WikiHelpers.GetUniqueCode() + Path.GetExtension(destinationFile);

            file.SaveAs(destinationFile);

            return Path.GetFileName(destinationFile);
        }

        public void DeleteFile(string file)
        {
            throw new NotImplementedException();
        }

        public string[] GetFiles()
        {
            return Directory.EnumerateFiles(_imageLibraryPhysicalPath).Select(x => _imageLibraryRelativePath + "/" + Path.GetFileName(x)).ToArray();
        }
    }
}