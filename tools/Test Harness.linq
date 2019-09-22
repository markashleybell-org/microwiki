<Query Kind="Program">
  <Reference Relative="..\microwiki\bin\Debug\netcoreapp2.2\microwiki.dll">C:\Src\microwiki\microwiki\bin\Debug\netcoreapp2.2\microwiki.dll</Reference>
  <NuGetReference>Dapper</NuGetReference>
  <Namespace>Dapper</Namespace>
  <Namespace>MicroWiki</Namespace>
  <Namespace>MicroWiki.Abstract</Namespace>
  <Namespace>MicroWiki.Concrete</Namespace>
  <Namespace>MicroWiki.Controllers</Namespace>
  <Namespace>MicroWiki.Domain</Namespace>
  <Namespace>MicroWiki.Functions</Namespace>
  <Namespace>MicroWiki.Models</Namespace>
  <Namespace>MicroWiki.Support</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>Microsoft.Extensions.Options</Namespace>
</Query>

async Task Main()
{
    var repository = new SqlServerRepository(new TestOptionsMonitor(), "markb");
    
    var documents = await repository.ReadAllDocuments();
//    
//    var root = documents.Single(d => !d.ParentID.HasValue);
//    
//    var mapRoot = root.AsTree(documents);
//    
    documents.Dump();
//    // root.Dump();
//    // mapRoot.Dump();
//
//    var htmlTree = Functions.GetSiteMapTreeHtml(mapRoot, root.ID).Value;
//
//    var html = $"<html>{htmlTree}<html>";
//    
//    Util.RawHtml(html).Dump();

    repository.GetBreadcrumbTrail();
}

public class TestOptionsMonitor : IOptionsMonitor<Settings> 
{
    private Settings _settings = new Settings {
        ConnectionString = "Server=localhost;Database=microwiki;Trusted_Connection=yes"  
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