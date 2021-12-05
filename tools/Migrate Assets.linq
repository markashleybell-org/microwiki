<Query Kind="Program">
  <Reference Relative="..\microwiki\bin\Debug\net5.0\microwiki.dll">C:\Src\microwiki\microwiki\bin\Debug\net5.0\microwiki.dll</Reference>
  <NuGetReference>Dapper</NuGetReference>
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Dapper</Namespace>
  <Namespace>Microsoft.AspNetCore.Hosting</Namespace>
  <Namespace>Microsoft.AspNetCore.Http</Namespace>
  <Namespace>Microsoft.AspNetCore.Identity</Namespace>
  <Namespace>Microsoft.Data.SqlClient</Namespace>
  <Namespace>Microsoft.Extensions.FileProviders</Namespace>
  <Namespace>Microsoft.Extensions.Options</Namespace>
  <Namespace>MicroWiki</Namespace>
  <Namespace>MicroWiki.Abstract</Namespace>
  <Namespace>MicroWiki.Concrete</Namespace>
  <Namespace>MicroWiki.Controllers</Namespace>
  <Namespace>MicroWiki.Domain</Namespace>
  <Namespace>MicroWiki.Functions</Namespace>
  <Namespace>MicroWiki.Models</Namespace>
  <Namespace>MicroWiki.Support</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Bson</Namespace>
  <Namespace>Newtonsoft.Json.Converters</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>Newtonsoft.Json.Schema</Namespace>
  <Namespace>Newtonsoft.Json.Serialization</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>System.Web</Namespace>
  <IncludeAspNet>true</IncludeAspNet>
  <RuntimeVersion>5.0</RuntimeVersion>
</Query>

async Task Main()
{    
    var readCurrentSql = "SELECT ID, ParentID, Title, Body, Slug, Location, '' AS Tags, Username, Created, Updated, IsPublic FROM Documents WHERE Body LIKE '%/usercontent%'";
    var updateCurrentSql = "UPDATE Documents SET Body = @NewBody WHERE ID = @ID";
    
    var readDeletedSql = readCurrentSql.Replace("Documents", "DeletedDocuments");
    var updateDeletedSql = updateCurrentSql.Replace("Documents", "DeletedDocuments");

    var config = JObject.Parse(File.ReadAllText(Path.GetDirectoryName(Util.CurrentQueryPath) + @"\migrateconfig.json"));

    var connectionString = config["ConnectionString"].ToString();
    var physicalPath = config["PhysicalPath"].ToString();

    connectionString.Dump("Connection String");
    physicalPath.Dump("Asset Path");

    await Migrate(connectionString, physicalPath, "CURRENT", readCurrentSql, updateCurrentSql);
    await Migrate(connectionString, physicalPath, "DELETED", readDeletedSql, updateDeletedSql);
}

public static async Task Migrate(string connectionString, string physicalPath, string label, string readSql, string updateSql) 
{
    using var conn = new SqlConnection(connectionString);
    
    var docsWithAssetLinks = await conn.QueryAsync<MicroWiki.Domain.Document>(readSql);

    var assetPattern = new Regex(@"(?<preamble>(?:\((?:\s+)?|:\s+|src="")(?:https?://wiki\.webselect\.net)?/usercontent/)(?<filename>.*\.[a-z0-9]+)", RegexOptions.IgnoreCase);

    var replacements = docsWithAssetLinks
        .Select(d => {
            var matches = assetPattern.Matches(d.Body);
            
            var replacements = new List<Replacement>();
            var fileMoves = new List<FileMove>();
            
            var newBody = assetPattern
                .Replace(d.Body, m => {
                    var filename = m.Groups["filename"].Value;
                    var decodedFileName = HttpUtility.UrlDecode(filename);
                    var replacement = $"{m.Groups["preamble"]}{d.ID}/{filename}";
                    replacements.Add(new Replacement { Before = m.Value, After = replacement });
                    fileMoves.Add(new FileMove { From = $@"{physicalPath}\{decodedFileName}", To = $@"{physicalPath}\{d.ID}\{decodedFileName}" });
                    return replacement;
                });
            
            return new { 
                d.ID,
                d.Location,
                Matches = matches,
                Replacements = replacements,
                FileMoves = fileMoves,
                d.Body, 
                NewBody = newBody,
                Diff = Util.Dif(d.Body, newBody)
            };
        });
    
    //replacements.Select(r => new { 
    //    r.ID, 
    //    r.Replacements, 
    //    r.FileMoves,
    //    r.Diff, 
    //    //r.Body,
    //    //r.NewBody,
    //}).Dump();
    
    foreach (var r in replacements)
    {
        Console.WriteLine($"{label}: {r.ID} {r.Location}");
        
        foreach (var fm in r.FileMoves)
        {
             Directory.CreateDirectory(Path.GetDirectoryName(fm.To));
             
            try 
            {
                File.Move(fm.From, fm.To);
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(Util.Highlight($"{label}: {fm.From} already moved or not found: manually check {r.Location}"));
            }
        }
        
        await conn.ExecuteAsync(updateSql, new { r.NewBody, r.ID });
    }
}

public class Replacement 
{
    public string Before { get; set; }
    
    public string After { get; set; }
}

public class FileMove 
{
    public string From { get; set; }
    
    public string To { get; set; }
}
