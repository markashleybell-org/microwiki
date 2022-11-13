using System;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Domain;
using MicroWiki.Functions;
using MicroWiki.Support;

namespace MicroWiki.Concrete
{
    public class LuceneSearchService : ISearchService
    {
        public LuceneSearchService(IOptions<Settings> options) =>
            LuceneSearchFunctions.Init(options.Value.SearchIndexBasePath);

        public void DeleteAndRebuildIndex(IEnumerable<Document> documents) =>
            LuceneSearchFunctions.DeleteAndRebuildIndex(documents);

        public void AddDocument(Document document) =>
            LuceneSearchFunctions.AddDocument(document);

        public void RemoveDocument(Document document) =>
            LuceneSearchFunctions.RemoveDocument(document);

        public void RemoveDocument(Guid documentID) =>
            LuceneSearchFunctions.RemoveDocument(documentID);

        public void UpdateDocument(Document document) =>
            LuceneSearchFunctions.UpdateDocument(document);

        public IEnumerable<SearchResult> Search(string query, bool publicOnly) =>
            LuceneSearchFunctions.Search(query, publicOnly);
    }
}
