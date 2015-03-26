using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using Newtonsoft.Json.Linq;

namespace microwiki.Helpers
{
    public class RemoteFileBrowser : IFileBrowser
    {
        public string[] GetFiles(string physicalPath, string relativePath)
        {
            using (var webClient = new WebClient())
            {
                string json = webClient.DownloadString(physicalPath);
                string[] files = JArray.Parse(json).Select(x => relativePath + "/" + x.Value<string>()).ToArray();
                return files;
            }
        }
    }
}