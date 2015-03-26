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
    public class RemoteFileUploader : IFileUploader
    {
        public string UploadFile(HttpPostedFileBase file, string destinationFolder, string destinationFileName)
        {
            using (var ftpClient = new FtpClient())
            {
                ftpClient.Host = ConfigurationManager.AppSettings["RemoteUploaderHost"];
                ftpClient.DataConnectionType = FtpDataConnectionType.AutoActive;
                ftpClient.Credentials = new NetworkCredential(ConfigurationManager.AppSettings["RemoteUploaderUsername"], 
                                                              ConfigurationManager.AppSettings["RemoteUploaderPassword"]);

                ftpClient.Connect();
                ftpClient.CreateDirectory(Path.GetDirectoryName(destinationFolder));
                ftpClient.SetWorkingDirectory("/");

                byte[] buf = new byte[8192];
                int read = 0;

                using (var remoteStream = ftpClient.OpenWrite(destinationFolder + "/" + destinationFileName))
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

                return destinationFileName;
            }
        }
    }
}