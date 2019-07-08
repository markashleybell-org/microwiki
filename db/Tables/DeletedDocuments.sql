CREATE TABLE [dbo].[DeletedDocuments] (
    [ID]       UNIQUEIDENTIFIER  NOT NULL,
    [ParentID] UNIQUEIDENTIFIER  CONSTRAINT [DF_DeletedDocuments_ParentID] DEFAULT ('home') NOT NULL,
    [Title]    NVARCHAR (128) NOT NULL,
    [Body]     NVARCHAR (MAX) NULL,
    [Slug]     NVARCHAR (256) NULL,
    [Location] NVARCHAR (256) NULL,
    [Username] NVARCHAR (128) NOT NULL,
    [TOC]      BIT            CONSTRAINT [DF_DeletedDocuments_TOC] DEFAULT ((0)) NOT NULL,
    [Created]  DATETIME       CONSTRAINT [DF_DeletedDocuments_Created] DEFAULT (getdate()) NOT NULL,
    [Updated]  DATETIME       CONSTRAINT [DF_DeletedDocuments_Updated] DEFAULT (getdate()) NOT NULL,
    [Deleted]  DATETIME       CONSTRAINT [DF_DeletedDocuments_Deleted] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_DeletedDocuments] PRIMARY KEY CLUSTERED ([ID] ASC)
);

