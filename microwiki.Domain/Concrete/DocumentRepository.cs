using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using microwiki.Domain.Entities;
using microwiki.Domain.Abstract;

namespace microwiki.Domain.Concrete 
{
    public class DocumentRepository : RepositoryBase<Document>, IDocumentRepository
    {
        public DocumentRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { }
    }
}
