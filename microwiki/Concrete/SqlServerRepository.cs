using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
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
        private readonly string _username;

        public SqlServerRepository(
            IOptionsMonitor<Settings> optionsMonitor,
            string username)
        {
            _cfg = optionsMonitor.CurrentValue;
            _username = username;
        }

        public async Task<IEnumerable<BreadcrumbTrailSegment>> GetBreadcrumbTrail(Guid id) =>
            await WithConnection(async conn => {
                return await conn.QuerySp<BreadcrumbTrailSegment>(
                    sql: "GetBreadcrumbTrail",
                    param: new { ID = id }
                );
            });

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
                var document = await conn.QuerySingleOrDefaultSp<Document>(
                    sql: "ReadDocument",
                    param: new { Location = "/" + location }
                );

                if (document == null)
                {
                    return default;
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

        public async Task<IEnumerable<SiteMapDocument>> ReadAllDocuments() =>
            await WithConnection(async conn => {
                return await conn.QuerySp<SiteMapDocument>(
                    sql: "ReadDocuments",
                    param: new { ParentID = default(Guid?) }
                );
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

        public async Task DeleteDocument(Guid id) =>
            await WithConnection(async conn => {
                await conn.ExecuteSp(
                    sql: "DeleteDocument",
                    param: new {
                        ID = id,
                        Username = _username
                    }
                );
            });

        public async Task<string> MoveDocument(Guid id, Guid newParentId) =>
            await WithConnection(async conn => {
                var param = new {
                    ID = id,
                    ParentID = newParentId,
                    Username = _username
                };

                return await conn.QuerySingleSp<string>(
                    sql: "MoveDocument",
                    param: param
                );
            });

        private async Task WithConnection(Func<SqlConnection, Task> action)
        {
            using (var connection = new SqlConnection(_cfg.ConnectionString))
            {
                await action(connection);
            }
        }

        private async Task<T> WithConnection<T>(Func<SqlConnection, Task<T>> action)
        {
            using (var connection = new SqlConnection(_cfg.ConnectionString))
            {
                return await action(connection);
            }
        }
    }
}
