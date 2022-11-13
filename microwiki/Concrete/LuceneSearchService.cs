using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Lucene.Net.Analysis.En;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using Lucene.Net.Search.Highlight;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Markdig;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Domain;
using MicroWiki.Support;
using static MicroWiki.Functions.Functions;
using l = Lucene.Net.Documents;

namespace MicroWiki.Concrete
{
    public class LuceneSearchService : ISearchService
    {
#pragma warning disable IDE1006 // Naming Styles
        private const LuceneVersion _luceneVersion = LuceneVersion.LUCENE_48;
#pragma warning restore IDE1006 // Naming Styles

        private readonly Settings _cfg;
        private readonly IDateTimeService _dateTimeService;

        public LuceneSearchService(
            IOptionsMonitor<Settings> optionsMonitor,
            IDateTimeService dateTimeService)
        {
            _cfg = optionsMonitor.CurrentValue;
            _dateTimeService = dateTimeService;
        }

        public void DeleteAndRebuildIndex(IEnumerable<Document> documents)
        {
            System.IO.Directory.CreateDirectory(_cfg.SearchIndexBasePath);

            WithIndexWriter(writer => writer.AddDocuments(documents.Select(AsDocument)), overwriteIndex: true);
        }

        public void AddDocument(Document document) =>
            WithIndexWriter(writer => writer.AddDocument(AsDocument(document)));

        public void RemoveDocument(Document document) =>
            RemoveDocument(document.ID);

        public void RemoveDocument(Guid documentID) =>
            WithIndexWriter(writer => writer.DeleteDocuments(new Term("id", documentID.ToString())), applyDeletes: true);

        public void UpdateDocument(Document document) =>
            WithIndexWriter(writer => writer.UpdateDocument(new Term("id", document.ID.ToString()), AsDocument(document)));

        public IEnumerable<SearchResult> Search(string query, bool publicOnly)
        {
            using var dir = FSDirectory.Open(_cfg.SearchIndexBasePath);

            using IndexReader reader = DirectoryReader.Open(dir);

            var searcher = new IndexSearcher(reader);

            var analyzer = new EnglishAnalyzer(_luceneVersion);

            var boosts = new Dictionary<string, float> {
                ["title"] = 1.0f,
                ["tags"] = 1.5f,
                ["body"] = 0.8f
            };

            var parser = new MultiFieldQueryParser(_luceneVersion, new[] { "title", "tags", "body" }, analyzer, boosts);

            var luceneQuery = parser.Parse(query);

            var hits = searcher.Search(luceneQuery, n: 20).ScoreDocs;

            var formatter = new SimpleHTMLFormatter();
            var highlighter = new Highlighter(formatter, new QueryScorer(luceneQuery));

            // We don't care about the created/updated date here, as we're just ordering by score anyway
            var now = _dateTimeService.Now;

            var results = hits.Select(h => {
                var doc = searcher.Doc(h.Doc);

                var body = doc.Get("body");
                var tokenStream = TokenSources.GetAnyTokenStream(searcher.IndexReader, h.Doc, "body", analyzer);
                var fragments = highlighter.GetBestTextFragments(tokenStream, body, true, 10);

                return new SearchResult(
                    h.Score,
                    Guid.Parse(doc.Get("id")),
                    doc.Get("title"),
                    doc.Get("body"),
                    doc.Get("location"),
                    TagList(doc.Get("tags")),
                    bool.Parse(doc.Get("ispublic")),
                    fragments.Select(f => f.ToString()).ToArray()
                );
            });

            // IMPORTANT: ToList materialises the query results; if we don't do this we get an ObjectDisposedException
            return results
                .Where(r => r.IsPublic == publicOnly || r.IsPublic)
                .OrderByDescending(r => r.Score)
                .ToList();
        }

        /*
        If a token contains any non-digit characters, do a fuzzy search.
        We search for both an exact match *and* a fuzzy match, and the
        exact match is boosted so it ranks higher in the results.
        If the token is numeric, it's almost definitely a product code,
        so we look for an exact match only.
        */
        private static string LuceneTokenTransform(string token) =>
            Regex.IsMatch(token, @"\D+") ? $"({token}* OR {token}^2 OR {token}~1)" : token;

        private static string SanitiseQuery(string query)
        {
            var sanitisedQuery = new StringBuilder(query);

            sanitisedQuery.Replace("-", " ");
            sanitisedQuery.Replace("(", " ");
            sanitisedQuery.Replace(")", " ");
            sanitisedQuery.Replace("[", " ");
            sanitisedQuery.Replace("]", " ");
            sanitisedQuery.Replace("\t", " ");
            sanitisedQuery.Replace("\r", " ");
            sanitisedQuery.Replace("\n", " ");
            sanitisedQuery.Replace("*", " ");

            return sanitisedQuery.ToString();
        }

        private static string LuceneQueryFrom(string query) =>
            LuceneQueryFrom(query, SanitiseQuery, LuceneTokenTransform);

        private static string LuceneQueryFrom(
            string query,
            Func<string, string> sanitiseQuery,
            Func<string, string> queryTokenTransform)
        {
            if (sanitiseQuery is null)
            {
                throw new ArgumentNullException(nameof(sanitiseQuery));
            }

            if (queryTokenTransform is null)
            {
                throw new ArgumentNullException(nameof(queryTokenTransform));
            }

            if (string.IsNullOrWhiteSpace(query))
            {
                return null;
            }

            var normalisedQuery = Regex.Replace(sanitiseQuery(query).Trim(), @"\s{2,}", " ");

            if (string.IsNullOrWhiteSpace(normalisedQuery))
            {
                return null;
            }

            // Use fuzzy search if the term doesn't match something
            var terms = normalisedQuery.Split(' ').Select(queryTokenTransform);

            return string.Join(" ", terms);
        }

        private static l.Document AsDocument(Document document) =>
            new() {
                new l.StringField("id", document.ID.ToString(), l.Field.Store.YES),
                new l.TextField("title", document.Title, l.Field.Store.YES),
                new l.TextField("body", Markdown.ToPlainText(document.Body ?? string.Empty), l.Field.Store.YES),
                new l.StringField("location", document.Location, l.Field.Store.YES),
                new l.TextField("tags", TagString(document.Tags) ?? string.Empty, l.Field.Store.YES),
                new l.StringField("ispublic", document.IsPublic.ToString(), l.Field.Store.YES)
            };

        private void WithIndexWriter(Action<IndexWriter> f, bool overwriteIndex = false, bool applyDeletes = false)
        {
            var analyzer = new EnglishAnalyzer(_luceneVersion);

            var writerConfig = new IndexWriterConfig(_luceneVersion, analyzer) {
                OpenMode = overwriteIndex ? OpenMode.CREATE : OpenMode.CREATE_OR_APPEND
            };

            using var dir = FSDirectory.Open(_cfg.SearchIndexBasePath);

            using var writer = new IndexWriter(dir, writerConfig);

            f(writer);

            writer.Flush(triggerMerge: false, applyAllDeletes: applyDeletes);
        }
    }
}
