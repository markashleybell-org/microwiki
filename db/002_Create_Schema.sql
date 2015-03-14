USE [MicroWiki]
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Documents')
BEGIN
    CREATE TABLE [Documents] (
        [ID] nvarchar(64) NOT NULL, 
        [ParentID] nvarchar(64) NOT NULL, 
        [Title] nvarchar(128) NOT NULL, 
        [Body] nvarchar(max) NULL,
        [Slug] nvarchar(256) NULL, 
        [Location] nvarchar(256) NULL, 
        [Username] nvarchar(128) NOT NULL, 
        [Created] datetime NOT NULL,
        [Updated] datetime NOT NULL
    )
    ALTER TABLE [Documents] ADD CONSTRAINT [PK_Documents] PRIMARY KEY ([ID])
    ALTER TABLE [Documents] ADD CONSTRAINT [FK_Documents_Documents] FOREIGN KEY (ParentID) REFERENCES [Documents] (ID) 	
    ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_ParentID] DEFAULT ('home') FOR [ParentID]
    ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_Created] DEFAULT (getdate()) FOR [Created]
    ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_Updated] DEFAULT (getdate()) FOR [Updated]
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'DeletedDocuments')
BEGIN
    CREATE TABLE [DeletedDocuments] (
	    [ID] nvarchar(64) NOT NULL, 
        [ParentID] nvarchar(64) NOT NULL, 
        [Title] nvarchar(128) NOT NULL, 
        [Body] nvarchar(max) NULL,
        [Slug] nvarchar(256) NULL, 
        [Location] nvarchar(256) NULL, 
        [Username] nvarchar(128) NOT NULL, 
        [Created] datetime NOT NULL,
        [Updated] datetime NOT NULL,
        [Deleted] datetime NOT NULL
    )
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [PK_DeletedDocuments] PRIMARY KEY ([ID])
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_ParentID] DEFAULT ('home') FOR [ParentID]
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_Created] DEFAULT (getdate()) FOR [Created]
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_Updated] DEFAULT (getdate()) FOR [Updated]
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_Deleted] DEFAULT (getdate()) FOR [Deleted]
END
GO

