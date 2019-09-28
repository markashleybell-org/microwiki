CREATE TABLE [dbo].[Tags_Documents]
(
    [TagID] UNIQUEIDENTIFIER NOT NULL , 
    [DocumentID] UNIQUEIDENTIFIER NOT NULL, 
    PRIMARY KEY ([TagID], [DocumentID]), 
    CONSTRAINT [FK_Tags_Documents_Tags] FOREIGN KEY ([TagID]) REFERENCES [Tags]([ID]), 
    CONSTRAINT [FK_Tags_Documents_Documents] FOREIGN KEY ([DocumentID]) REFERENCES [Documents]([ID])
)
