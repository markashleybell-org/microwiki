<Query Kind="Program">
  <NuGetReference>Dapper</NuGetReference>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>Dapper</Namespace>
</Query>

async void Main()
{
    var doc = await WithConnection(async conn =>
    {
        var document = await conn.QuerySingleAsync<Doc>(
            sql: "EXEC ReadDocument NULL, @Location",
            param: new { Location = "/" }
        );

        if (document == null)
        {
            return null;
        }

        // var c = await conn.QuerySingleAsync<int>("SELECT COUNT(*) FROM Documents");

        var children = await conn.QueryAsync<Doc>(
            sql: "EXEC ReadDocuments @ParentID",
            param: new { ParentID = document.ID }
        );

        children.Dump();

        return document; // .WithChildren(children);
    });
    
    doc.Dump();
}

private async Task<T> WithConnection<T>(Func<SqlConnection, Task<T>> action)
{
    using (var connection = new SqlConnection("Server=localhost;Database=microwiki;Trusted_Connection=yes"))
    {
        return await action(connection);
    }
}

public class Doc {
    public Guid ID { get; set; }
    public string Title { get; set; }
}