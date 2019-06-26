CREATE TABLE [dbo].[Documents] (
    [ID]       NVARCHAR (64)  NOT NULL,
    [ParentID] NVARCHAR (64)  CONSTRAINT [DF_Documents_ParentID] DEFAULT ('home') NOT NULL,
    [Title]    NVARCHAR (128) NOT NULL,
    [Body]     NVARCHAR (MAX) NULL,
    [Slug]     NVARCHAR (256) NULL,
    [Location] NVARCHAR (256) NULL,
    [Username] NVARCHAR (128) NOT NULL,
    [TOC]      BIT            CONSTRAINT [DF_Documents_TOC] DEFAULT ((0)) NOT NULL,
    [Created]  DATETIME       CONSTRAINT [DF_Documents_Created] DEFAULT (getdate()) NOT NULL,
    [Updated]  DATETIME       CONSTRAINT [DF_Documents_Updated] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_Documents] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Documents_Documents] FOREIGN KEY ([ParentID]) REFERENCES [dbo].[Documents] ([ID])
);

