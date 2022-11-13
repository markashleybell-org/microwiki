using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Lucene.Net.Analysis.En;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using Lucene.Net.Search.Highlight;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Markdig;
using MicroWiki.Domain;
using static MicroWiki.Functions.Functions;

namespace MicroWiki.Functions
{
    public static class LuceneSearchFunctions
    {
#pragma warning disable IDE1006 // Naming Styles
        private const LuceneVersion _luceneVersion = LuceneVersion.LUCENE_48;
#pragma warning restore IDE1006 // Naming Styles

        private static readonly string[] LuceneSpecialCharacters =
            "\\ + - & || ! ( ) { } [ ] ^ \" ~ * ? : /".Split(new[] { ' ' });

        private static string _searchIndexBasePath;

        private static IndexWriter _indexWriter;

        public static void Init(string searchIndexBasePath)
        {
            _searchIndexBasePath = searchIndexBasePath;

            InitIndexWriter(OpenMode.CREATE_OR_APPEND);
        }

        public static void DeleteAndRebuildIndex(IEnumerable<Domain.Document> documents)
        {
            System.IO.Directory.CreateDirectory(_searchIndexBasePath);

            _indexWriter.Dispose();

            InitIndexWriter(OpenMode.CREATE);

            WithIndexWriter(writer => writer.AddDocuments(documents.Select(AsDocument)));

            _indexWriter.Dispose();

            InitIndexWriter(OpenMode.CREATE_OR_APPEND);
        }

        public static void AddDocument(Domain.Document document) =>
            WithIndexWriter(writer => writer.AddDocument(AsDocument(document)));

        public static void RemoveDocument(Domain.Document document) =>
            RemoveDocument(document.ID);

        public static void RemoveDocument(Guid documentID) =>
            WithIndexWriter(writer => writer.DeleteDocuments(new Term("id", documentID.ToString())), applyAllDeletes: true);

        public static void UpdateDocument(Domain.Document document) =>
            WithIndexWriter(writer => writer.UpdateDocument(new Term("id", document.ID.ToString()), AsDocument(document)));

        public static IEnumerable<SearchResult> Search(string query, bool publicOnly)
        {
            var searcher = new IndexSearcher(_indexWriter.GetReader(applyAllDeletes: true));

            var analyzer = new EnglishAnalyzer(_luceneVersion);

            var boosts = new Dictionary<string, float> {
                ["title"] = 1.0f,
                ["tags"] = 1.5f,
                ["body"] = 0.8f
            };

            var parser = new MultiFieldQueryParser(_luceneVersion, new[] { "title", "tags", "body" }, analyzer, boosts);

            var luceneQuery = parser.Parse(LuceneQueryFrom(query));

            var hits = searcher.Search(luceneQuery, n: 20).ScoreDocs;

            var formatter = new SimpleHTMLFormatter();
            var highlighter = new Highlighter(formatter, new QueryScorer(luceneQuery));

            var results = hits.Select(h => {
                var doc = searcher.Doc(h.Doc);

                var body = doc.Get("body");
                var tokenStream = TokenSources.GetAnyTokenStream(searcher.IndexReader, h.Doc, "body", analyzer);
                var fragments = highlighter.GetBestTextFragments(tokenStream, body, true, 10);

                return new SearchResult(
                    h.Score,
                    DateTools.StringToDate(doc.Get("updated")),
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
                .ThenByDescending(r => r.LastUpdate)
                .ToList();
        }

        private static string SanitiseQuery(string query)
        {
            if (Regex.IsMatch(query, @"CHR\(\d+\)", RegexOptions.IgnoreCase))
            {
                // This is a common SQL injection pattern, and there's no legitimate reason
                // it should be included in a search query, so just return nothing.
                return default;
            }

            var sanitisedQuery = new StringBuilder(query);

            foreach (var c in LuceneSpecialCharacters)
            {
                sanitisedQuery.Replace(c, @"\" + c);
            }

            return sanitisedQuery.ToString();
        }

        private static string LuceneQueryFrom(string query)
        {
            var q = SanitiseQuery(query);

            return $"\"{q}\"^1 " + LuceneQueryFrom(q, q => q, token => $"{token}^0.6 {token}*^0.4 {token}~2");
        }

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

        private static Lucene.Net.Documents.Document AsDocument(Domain.Document document) =>
            new() {
                new StringField("id", document.ID.ToString(), Field.Store.YES),
                new TextField("title", document.Title, Field.Store.YES),
                new TextField("body", Markdown.ToPlainText(document.Body ?? string.Empty), Field.Store.YES),
                new StringField("location", document.Location, Field.Store.YES),
                new TextField("tags", TagString(document.Tags) ?? string.Empty, Field.Store.YES),
                new StringField("ispublic", document.IsPublic.ToString(), Field.Store.YES),
                new TextField("created", DateTools.DateToString(document.Created, DateResolution.SECOND), Field.Store.YES),
                new TextField("updated", DateTools.DateToString(document.Updated, DateResolution.SECOND), Field.Store.YES)
            };

        private static void InitIndexWriter(OpenMode openMode)
        {
            var analyzer = new EnglishAnalyzer(_luceneVersion);

            var writerConfig = new IndexWriterConfig(_luceneVersion, analyzer) {
                OpenMode = openMode
            };

            _indexWriter = new IndexWriter(FSDirectory.Open(_searchIndexBasePath), writerConfig);
        }

        private static void WithIndexWriter(Action<IndexWriter> f, bool applyAllDeletes = false)
        {
            f(_indexWriter);

            _indexWriter.Flush(triggerMerge: false, applyAllDeletes: applyAllDeletes);
        }
    }
}
