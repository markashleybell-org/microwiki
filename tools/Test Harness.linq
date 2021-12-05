<Query Kind="Program">
  <Reference Relative="..\microwiki\bin\Debug\net5.0\microwiki.dll">C:\Src\microwiki\microwiki\bin\Debug\net5.0\microwiki.dll</Reference>
  <NuGetReference>Dapper</NuGetReference>
  <Namespace>Dapper</Namespace>
  <Namespace>Microsoft.AspNetCore.Identity</Namespace>
  <Namespace>Microsoft.Extensions.Options</Namespace>
  <Namespace>MicroWiki</Namespace>
  <Namespace>MicroWiki.Abstract</Namespace>
  <Namespace>MicroWiki.Concrete</Namespace>
  <Namespace>MicroWiki.Controllers</Namespace>
  <Namespace>MicroWiki.Domain</Namespace>
  <Namespace>MicroWiki.Functions</Namespace>
  <Namespace>MicroWiki.Models</Namespace>
  <Namespace>MicroWiki.Support</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>Microsoft.AspNetCore.Hosting</Namespace>
  <Namespace>Microsoft.Extensions.FileProviders</Namespace>
  <Namespace>Microsoft.AspNetCore.Http</Namespace>
  <IncludeAspNet>true</IncludeAspNet>
  <RuntimeVersion>5.0</RuntimeVersion>
</Query>

async Task Main()
{    
    var svc = new LocalFileManager(new TestWebHostEnvironment(), new TestOptionsMonitor());
    
    var path = @"C:\Src\microwiki\tools\testfile.jpg";
    var fileName = Path.GetFileName(path);
    
    var stream = File.OpenRead(path);
    var file = new FormFile(stream, 0, stream.Length, fileName, fileName);
    
    var upload = await svc.UploadFile(file, $"{Guid.NewGuid()}/{file.FileName}");
    
    upload.ToString().Dump();
    
    svc.GetFiles().Select(x => x.ToString()).Dump();
    
    // Functions.CreatePhysicalPath("/a//b\\/", "\\\\c/de", "f//", "/g\\", "test.jpg").Dump();
    // Functions.CreateUrlPath("/a//b\\/", "\\\\c/de", "f//", "/g\\", "test.jpg").Dump();
    
    // var repository = new SqlServerRepository(new TestOptionsMonitor(), "markb");
    
    // var documents = await repository.ReadAllDocuments();
//    
//    var root = documents.Single(d => !d.ParentID.HasValue);
//    
//    var mapRoot = root.AsTree(documents);
//    
    // documents.Dump();
//    // root.Dump();
//    // mapRoot.Dump();
//
//    var htmlTree = Functions.GetSiteMapTreeHtml(mapRoot, root.ID).Value;
//
//    var html = $"<html>{htmlTree}<html>";
//    
//    Util.RawHtml(html).Dump();

    //var trail = await repository.GetBreadcrumbTrail(new Guid("9883784f-716f-4171-a5a3-659f111eee4b"));
    //
    //trail.Dump();
    //
    // new PasswordHasher<User>().HashPassword(new User(new Guid("e5754cce-838b-4446-ada8-2d5a6e057555"), "me@markb.co.uk", "test123"), "test123").Dump();
}

public class TestWebHostEnvironment : IWebHostEnvironment 
{
    public TestWebHostEnvironment()
    {
        WebRootPath = @"C:\Src\microwiki\tools\test";
    }
    
    public string WebRootPath { get; set; }
    
    public IFileProvider WebRootFileProvider { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    
    public string ApplicationName { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    
    public IFileProvider ContentRootFileProvider { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    
    public string ContentRootPath { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    
    public string EnvironmentName { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
}

public class TestOptionsMonitor : IOptionsMonitor<Settings> 
{
    private Settings _settings = new Settings {
        ConnectionString = "Server=localhost;Database=microwiki;Trusted_Connection=yes;TrustServerCertificate=true",
        LocalFileManagerLibraryFolderPath = "/usercontent"
    };
    
    public Settings CurrentValue => _settings;

    public Settings Get(string name)
    {
        throw new NotImplementedException();
    }

    public IDisposable OnChange(Action<Settings, string> listener)
    {
        throw new NotImplementedException();
    }
}