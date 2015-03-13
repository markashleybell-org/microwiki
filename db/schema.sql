USE [master]
GO

IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'MicroWiki')
BEGIN
	DECLARE @kill varchar(8000) = '';
	SELECT @kill = @kill + 'kill ' + CONVERT(varchar(5), spid) + ';'
	FROM master..sysprocesses 
	WHERE dbid = db_id('MicroWiki')
	EXEC(@kill)
	DROP DATABASE [MicroWiki]
END
GO

CREATE DATABASE [MicroWiki]
GO

USE [MicroWiki]
GO

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

DECLARE @RootID nvarchar(128) = LOWER(NEWID())

INSERT INTO [Documents] 
    ([ID], [ParentID], [Title], [Body], [Location], [Username])
VALUES 
    (@RootID, @RootID, 'Welcome to MicroWiki!', 'You can [Edit](/wiki/update/' + @RootID + ') this page now, or [Add Child Pages](/wiki/create/' + @RootID + ').', '/', 'SYSTEM');
GO

SELECT * FROM [Documents]
GO
