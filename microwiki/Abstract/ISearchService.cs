using System.Collections.Generic;
using System.Threading.Tasks;
using MicroWiki.Domain;

namespace MicroWiki.Abstract
{
    public interface ISearchService
    {
        Task<IEnumerable<SearchResult>> Search(string query);
    }
}
