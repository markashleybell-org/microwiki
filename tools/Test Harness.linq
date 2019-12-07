<Query Kind="Program">
  <Reference Relative="..\microwiki\bin\Debug\netcoreapp3.1\microwiki.dll">C:\Src\microwiki\microwiki\bin\Debug\netcoreapp3.1\microwiki.dll</Reference>
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
  <IncludeAspNet>true</IncludeAspNet>
</Query>

async Task Main()
{
    var searchService = new SqlServerSearchService(new TestOptionsMonitor());
    
    var results = await searchService.Search("azure [azure]");
    
    results.Dump();
    
    searchService.ParseSearchQuery(" azure   [azure] vpn hosting  ").Dump();
    
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