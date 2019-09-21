using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MicroWiki.Domain;

namespace MicroWiki.Abstract
{
    public interface IRepository
    {
        Task<Document> CreateDocument(Document document);

        Task<Document> ReadDocument(string location);

        Task<Document> ReadDocument(Guid id);

        Task<IEnumerable<SiteMapDocument>> ReadAllDocuments();

        Task<Document> UpdateDocument(Document document);

        Task DeleteDocument(Guid id);

        Task<string> MoveDocument(Guid id, Guid newParentId);
    }
}
