using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MicroWiki.Domain;

namespace MicroWiki.Abstract
{
    public interface ISearchService
    {
        void DeleteAndRebuildIndex(IEnumerable<Document> documents);

        void AddDocument(Document document);

        void UpdateDocument(Document document);

        void RemoveDocument(Document document);

        void RemoveDocument(Guid documentID);

        IEnumerable<SearchResult> Search(string query, bool publicOnly);
    }
}
