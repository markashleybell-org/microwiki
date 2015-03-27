using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.FtpClient;
using System.Web;

namespace microwiki.Helpers
{
    public class RemoteFileManager : IFileManager
    {
        private string _host;
        private string _username;
        private string _password;
        private string _folder;

        public RemoteFileManager()
        {
            _host = ConfigurationManager.AppSettings["RemoteFileManagerHost"];
            _username = ConfigurationManager.AppSettings["RemoteFileManagerUsername"];
            _password = ConfigurationManager.AppSettings["RemoteFileManagerPassword"];
            _folder = ConfigurationManager.AppSettings["RemoteFileManagerLibraryFolder"];
        }

        public string UploadFile(HttpPostedFileBase file)
        {
            string destinationFile = _folder + ((_folder == "/") ? "" : "/") + Path.GetFileName(file.FileName);

            using (var ftpClient = new FtpClient())
            {
                ftpClient.Host = _host;
                ftpClient.DataConnectionType = FtpDataConnectionType.AutoActive;
                ftpClient.Credentials = new NetworkCredential(_username, _password);

                ftpClient.Connect();
                // ftpClient.CreateDirectory("/test");
                ftpClient.SetWorkingDirectory(_folder);

                byte[] buf = new byte[8192];
                int read = 0;

                using (var remoteStream = ftpClient.OpenWrite(destinationFile))
                {
                    using (var localStream = new MemoryStream())
                    {
                        // Copy the file data from the posted file into a MemoryStream
                        file.InputStream.CopyTo(localStream);
                        // Reset position of stream after copy, otherwise we get zero-length files...
                        localStream.Position = 0;

                        while ((read = localStream.Read(buf, 0, buf.Length)) > 0)
                        {
                            remoteStream.Write(buf, 0, read);
                        }
                    }
                }

                ftpClient.Disconnect();

                return Path.GetFileName(destinationFile);
            }
        }

        public void DeleteFile(string fileName)
        {
            using (var ftpClient = new FtpClient())
            {
                ftpClient.Host = _host;
                ftpClient.DataConnectionType = FtpDataConnectionType.AutoActive;
                ftpClient.Credentials = new NetworkCredential(_username, _password);

                ftpClient.Connect();
                // ftpClient.CreateDirectory("/test");
                ftpClient.SetWorkingDirectory(_folder);

                ftpClient.DeleteFile(_folder + ((_folder == "/") ? "" : "/") + fileName);

                ftpClient.Disconnect();
            }
        }

        public string[] GetFiles()
        {
            using (var webClient = new WebClient())
            {
                string json = webClient.DownloadString("http://" + _host);
                var jArray = JArray.Parse(json);
                string[] files = jArray.Count > 0 ? jArray.Select(x => "http://" + _host + "/" + x.Value<string>()).ToArray() : new string[0];
                return files;
            }
        }
    }
}