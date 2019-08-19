using System;
using System.Threading.Tasks;
using MicroWiki.Domain;

namespace MicroWiki.Abstract
{
    public interface IRepository
    {
        Task<Document> ReadDocument(string location);

        Task<Document> ReadDocument(Guid id);

        Task<Document> UpdateDocument(Document document);
    }
}
