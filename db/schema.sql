CREATE DATABASE [MicroWiki]
GO

USE [MicroWiki]
GO

CREATE TABLE [Documents] (
    [ID] nvarchar(128) NOT NULL, 
    [ParentID] nvarchar(128) NOT NULL, 
    [Location] nvarchar(256) NOT NULL, 
    [Username] nvarchar(128) NOT NULL, 
    [Body] nvarchar(max) NULL,
    [Created] datetime NOT NULL,
    [Updated] datetime NOT NULL
)
GO

ALTER TABLE [Documents] ADD CONSTRAINT [PK_Documents] PRIMARY KEY ([ID])
GO
ALTER TABLE [Documents] ADD CONSTRAINT [FK_Documents_Documents] FOREIGN KEY (ParentID) REFERENCES [Documents] (ID) 	
GO
ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_ParentID] DEFAULT ('home') FOR [ParentID]
GO
ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_Created] DEFAULT (getdate()) FOR [Created]
GO
ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_Updated] DEFAULT (getdate()) FOR [Updated]
GO

CREATE TABLE [DeletedDocuments] (
    [ID] nvarchar(128) NOT NULL, 
    [ParentID] nvarchar(128) NOT NULL, 
    [Location] nvarchar(256) NOT NULL, 
    [Username] nvarchar(128) NOT NULL, 
    [Body] nvarchar(max) NULL,
    [Created] datetime NOT NULL, 
    [Updated] datetime NOT NULL, 
    [Deleted] datetime NULL
)
GO

ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [PK_DeletedDocuments] PRIMARY KEY ([ID])
GO
ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_ParentID] DEFAULT ('home') FOR [ParentID]
GO
ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_Created] DEFAULT (getdate()) FOR [Created]
GO
ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_Updated] DEFAULT (getdate()) FOR [Updated]
GO
ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_Deleted] DEFAULT (getdate()) FOR [Deleted]
GO

INSERT INTO [Documents] 
    ([ID], [ParentID], [Location], [Username], [Body])
VALUES 
    ('HOME', 'home', 'home', 'MicroWiki', '# Welcome to MicroWiki!');
GO
