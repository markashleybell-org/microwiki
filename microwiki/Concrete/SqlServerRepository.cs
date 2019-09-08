using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Domain;
using MicroWiki.Support;

namespace MicroWiki.Concrete
{
    public class SqlServerRepository : IRepository
    {
        private readonly Settings _cfg;

        public SqlServerRepository(IOptionsMonitor<Settings> optionsMonitor) =>
            _cfg = optionsMonitor.CurrentValue;

        public async Task<Document> CreateDocument(Document document) =>
            await WithConnection(async conn => {
                var param = new {
                    document.ID,
                    document.ParentID,
                    document.Title,
                    document.Body,
                    document.Slug,
                    document.Username,
                    document.TOC
                };

                await conn.ExecuteSp(
                    sql: "CreateDocument",
                    param: param
                );

                return await ReadDocument(document.ID);
            });

        public async Task<Document> ReadDocument(string location) =>
            await WithConnection(async conn => {
                var document = await conn.QuerySingleSp<Document>(
                    sql: "ReadDocument",
                    param: new { Location = "/" + location }
                );

                if (document == null)
                {
                    return null;
                }

                var children = await conn.QuerySp<ChildDocument>(
                    sql: "ReadDocuments",
                    param: new { ParentID = document.ID }
                );

                return document.WithChildren(children);
            });

        public async Task<Document> ReadDocument(Guid id) =>
            await WithConnection(async conn => {
                var document = await conn.QuerySingleSp<Document>(
                    sql: "ReadDocument",
                    param: new { ID = id }
                );

                return document;
            });

        public async Task<Document> UpdateDocument(Document document) =>
            await WithConnection(async conn => {
                var param = new {
                    document.ID,
                    document.ParentID,
                    document.Title,
                    document.Body,
                    document.Slug,
                    document.Username,
                    document.TOC
                };

                await conn.ExecuteSp(
                    sql: "UpdateDocument",
                    param: param
                );

                return await ReadDocument(document.ID);
            });

        private async Task<T> WithConnection<T>(Func<SqlConnection, Task<T>> action)
        {
            using (var connection = new SqlConnection(_cfg.ConnectionString))
            {
                return await action(connection);
            }
        }
    }
}
