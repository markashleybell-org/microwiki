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

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Update_Document_Locations')
    DROP PROCEDURE [dbo].[mw_Update_Document_Locations]
GO

CREATE PROCEDURE [dbo].[mw_Update_Document_Locations] 
AS
BEGIN 
	SET NOCOUNT ON
	BEGIN TRY
		BEGIN TRAN	
			-- Insert all documents into a temporary table
			SELECT ID, ParentID, Slug, Location INTO #Documents FROM Documents
			-- Find the root/home document
			DECLARE @RootID nvarchar(64) = (SELECT ID FROM #Documents WHERE ParentID = ID)
			-- NULL out all Location fields
			UPDATE #Documents SET Location = NULL
			-- Update root/home document location specifically
			UPDATE #Documents SET Location = '/' WHERE ID = @RootID
			-- Update location for any children of the root/home document
			UPDATE #Documents SET Location = '/' + ISNULL(Slug, '') WHERE ParentID = @RootID
			-- Figure out how many documents still have an empty Location field
			DECLARE @Empty INT = (SELECT COUNT(*) FROM #Documents WHERE Location IS NULL)
			-- U
			WHILE (@Empty > 0)
			BEGIN
				UPDATE doc
				SET doc.Location = parent.Location + '/' + ISNULL(doc.Slug, '')
				FROM #Documents doc
				INNER JOIN #Documents parent ON parent.ID = doc.ParentID
				WHERE doc.ParentID != @RootID
				SET @Empty = (SELECT COUNT(*) FROM #Documents WHERE Location IS NULL)
				IF @Empty = 0 BREAK
			END

			UPDATE doc
			SET Location = tmp.Location
			FROM Documents doc
			INNER JOIN #Documents tmp ON doc.ID = tmp.ID
		COMMIT TRAN
		RETURN 0		
	END TRY
	BEGIN CATCH
		SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage, ERROR_LINE() AS ErrorLine
		IF(@@TRANCOUNT>0) ROLLBACK TRAN	
		RETURN -1	
	END CATCH	
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Create_Document')
    DROP PROCEDURE [dbo].[mw_Create_Document]
GO

CREATE PROCEDURE [dbo].[mw_Create_Document] 
(
    @ID nvarchar(64),
    @ParentID nvarchar(64),
    @Title nvarchar(128),
    @Body nvarchar(max),
    @Slug nvarchar(256),
    @Username nvarchar(128)
)
AS
BEGIN 
	SET NOCOUNT ON
	INSERT INTO Documents 
	    (ID, ParentID, Title, Body, Slug, Username)
    VALUES 
        (@ID, @ParentID, @Title, @Body, @Slug, @Username)
    EXEC mw_Update_Document_Locations
    SELECT Location FROM Documents WHERE ID = @ID
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Update_Document')
    DROP PROCEDURE [dbo].[mw_Update_Document]
GO

CREATE PROCEDURE [dbo].[mw_Update_Document] 
(
    @ID nvarchar(64),
    @ParentID nvarchar(64),
    @Title nvarchar(128),
    @Body nvarchar(max),
    @Slug nvarchar(256),
    @Username nvarchar(128)
)
AS
BEGIN 
	SET NOCOUNT ON
	UPDATE Documents SET 
	    ParentID = @ParentID, Title = @Title, Body = @Body, Slug = @Slug, Username = @Username
    WHERE 
        ID = @ID
    EXEC mw_Update_Document_Locations
    SELECT Location FROM Documents WHERE ID = @ID
END	
GO

USE [MicroWiki]
GO

DECLARE @RootID nvarchar(128) = LOWER(NEWID())

INSERT INTO [Documents] 
    ([ID], [ParentID], [Title], [Body], [Location], [Username])
VALUES 
    (@RootID, @RootID, 'Welcome to MicroWiki!', 'You can [Edit](/wiki/update/' + @RootID + ') this page now, or [Add Child Pages](/wiki/create/' + @RootID + ').', '/', 'SYSTEM');
GO

SELECT * FROM [Documents]
GO

