using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace microwiki.Helpers
{
    public interface IFileBrowser
    {
        string[] GetFiles(string physicalPath, string relativePath);
    }
}
