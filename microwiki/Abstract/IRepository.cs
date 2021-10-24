using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MicroWiki.Domain;

namespace MicroWiki.Abstract
{
    public interface IRepository
    {
        Task<IEnumerable<BreadcrumbTrailSegment>> GetBreadcrumbTrail(Guid id);

        Task<Document> CreateDocument(Document document);

        Task<Document> ReadDocument(string location);

        Task<Document> ReadDocument(Guid id);

        Task<IEnumerable<SiteMapDocument>> ReadDocuments();

        Task<IEnumerable<Document>> ReadDocumentsForSearchIndex();

        Task<Document> UpdateDocument(Document document);

        Task DeleteDocument(Guid id);

        Task<string> MoveDocument(Guid id, Guid newParentId);

        Task<IEnumerable<SiteMapDocument>> CheckFileUse(string location);

        Task<User> FindUserByEmail(string email);

        Task<IEnumerable<Tag>> GetTags();

        Task MergeTags(Guid id, IEnumerable<Guid> tagIdsToMerge);
    }
}
