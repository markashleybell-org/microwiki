using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace microwiki.Helpers
{
    public class LocalFileBrowser : IFileBrowser
    {
        public string[] GetFiles(string physicalPath, string relativePath)
        {
            return Directory.EnumerateFiles(physicalPath).Select(x => relativePath + "/" + Path.GetFileName(x)).ToArray();
        }
    }
}