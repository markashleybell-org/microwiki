using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Domain;
using MicroWiki.Support;

namespace MicroWiki.Concrete
{
    public class SqlServerSearchService : ISearchService
    {
        private readonly Settings _cfg;

        public SqlServerSearchService(IOptionsMonitor<Settings> optionsMonitor) =>
            _cfg = optionsMonitor.CurrentValue;

        public async Task<IEnumerable<SearchResult>> Search(string query)
        {
            using (var connection = new SqlConnection(_cfg.ConnectionString))
            {
                return await connection.QuerySp<SearchResult>(
                    sql: "SearchDocuments",
                    param: new { Query = query }
                );
            }
        }
    }
}
