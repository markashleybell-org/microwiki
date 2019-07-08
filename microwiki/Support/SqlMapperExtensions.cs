using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;

namespace MicroWiki.Support
{
    public static class SqlMapperExtensions
    {
        public static Task<IEnumerable<T>> QuerySp<T>(this SqlConnection conn, string sql, object param) =>
            conn.QueryAsync<T>(sql, param, commandType: CommandType.StoredProcedure);

        public static Task<T> QuerySingleSp<T>(this SqlConnection conn, string sql, object param) =>
            conn.QuerySingleAsync<T>(sql, param, commandType: CommandType.StoredProcedure);
    }
}
