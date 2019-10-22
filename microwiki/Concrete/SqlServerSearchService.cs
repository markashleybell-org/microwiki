using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
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
            var parsedQuery = ParseSearchQuery(query);

            if (!parsedQuery.parsed)
            {
                return Enumerable.Empty<SearchResult>();
            }

            using (var connection = new SqlConnection(_cfg.ConnectionString))
            {
                return await connection.QuerySp<SearchResult>(
                    sql: "SearchDocuments",
                    param: new {
                        Query = string.Join(" ", parsedQuery.terms),
                        Tags = parsedQuery.tags.AsDataRecords().AsTableValuedParameter("dbo.TagList")
                    }
                );
            }
        }

        public (bool parsed, IEnumerable<string> terms, IEnumerable<Tag> tags) ParseSearchQuery(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return (false, default, default);
            }

            // Simple regex-based parser will do for now
            var match = Regex.Matches(query, @"([^\s]+)", RegexOptions.IgnoreCase);

            var terms = new List<string>();
            var tags = new List<Tag>();

            if (match.Count > 0)
            {
                foreach (Group group in match)
                {
                    var v = group.Value;

                    var tagMatch = Regex.Match(v, @"\[([a-z0-9\-]+)\]", RegexOptions.IgnoreCase);

                    if (tagMatch.Success)
                    {
                        tags.Add(new Tag(tagMatch.Groups[1].Value));
                    }
                    else
                    {
                        terms.Add(group.Value);
                    }
                }
            }

            return (true, terms, tags);
        }
    }
}
