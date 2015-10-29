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
        [TOC] bit NOT NULL,
        [Created] datetime NOT NULL,
        [Updated] datetime NOT NULL
    )
    ALTER TABLE [Documents] ADD CONSTRAINT [PK_Documents] PRIMARY KEY ([ID])
    ALTER TABLE [Documents] ADD CONSTRAINT [FK_Documents_Documents] FOREIGN KEY (ParentID) REFERENCES [Documents] (ID) 	
    ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_ParentID] DEFAULT ('home') FOR [ParentID]
    ALTER TABLE [Documents] ADD CONSTRAINT [DF_Documents_TOC] DEFAULT (0) FOR [TOC]
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
        [TOC] bit NOT NULL,
        [Created] datetime NOT NULL,
        [Updated] datetime NOT NULL,
        [Deleted] datetime NOT NULL
    )
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [PK_DeletedDocuments] PRIMARY KEY ([ID])
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_ParentID] DEFAULT ('home') FOR [ParentID]
    ALTER TABLE [DeletedDocuments] ADD CONSTRAINT [DF_DeletedDocuments_TOC] DEFAULT (0) FOR [TOC]
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
    @Username nvarchar(128),
    @TOC bit
)
AS
BEGIN 
	SET NOCOUNT ON
	
	DECLARE @RandomSlug nvarchar(5)
	
	WHILE EXISTS (SELECT * FROM Documents WHERE Slug = @Slug)
	BEGIN
	    SET @RandomSlug = (SELECT LOWER(LEFT(NEWID(), 5)))
	    SET @Slug = @Slug + '-' + @RandomSlug
	END
	
	INSERT INTO Documents 
	    (ID, ParentID, Title, Body, Slug, Username, TOC)
    VALUES 
        (@ID, @ParentID, @Title, @Body, @Slug, @Username, @TOC)
        
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
    @Username nvarchar(128),
    @TOC bit
)
AS
BEGIN 
	SET NOCOUNT ON
	
	DECLARE @RandomSlug nvarchar(5)
	
	WHILE EXISTS (SELECT * FROM Documents WHERE Slug = @Slug AND ID != @ID)
	BEGIN
	    SET @RandomSlug = (SELECT LOWER(LEFT(NEWID(), 5)))
	    SET @Slug = @Slug + '-' + @RandomSlug
	END
	
	UPDATE Documents SET 
	    ParentID = @ParentID, 
	    Title = @Title, 
	    Body = @Body, 
	    Slug = @Slug, 
	    Username = @Username,
	    TOC = @TOC,
	    Updated = GETDATE()
    WHERE 
        ID = @ID
            
    EXEC mw_Update_Document_Locations
    
    SELECT 
        Location 
    FROM 
        Documents 
    WHERE 
        ID = @ID
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Move_Document')
    DROP PROCEDURE [dbo].[mw_Move_Document]
GO

CREATE PROCEDURE [dbo].[mw_Move_Document] 
(
    @ID nvarchar(64),
    @ParentID nvarchar(64),
    @Username nvarchar(128)
)
AS
BEGIN 
	SET NOCOUNT ON
	
	UPDATE Documents SET 
	    ParentID = @ParentID, 
	    Username = @Username,
	    Updated = GETDATE()
    WHERE 
        ID = @ID
        
    EXEC mw_Update_Document_Locations
    
    SELECT 
        Location 
    FROM 
        Documents 
    WHERE 
        ID = @ID
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Read_Document')
    DROP PROCEDURE [dbo].[mw_Read_Document]
GO

CREATE PROCEDURE [dbo].[mw_Read_Document] 
(
    @ID nvarchar(64) = NULL,
    @Location nvarchar(256) = NULL
)
AS
BEGIN 
	SET NOCOUNT ON
	
	IF @ID IS NOT NULL
	BEGIN
	    SELECT 
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            Created, 
            Updated,
            Username,
            TOC
        FROM 
            Documents 
        WHERE 
            ID = @ID
    END
    ELSE IF @Location IS NOT NULL
    BEGIN
	    SELECT 
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            Created, 
            Updated,
            Username,
            TOC
        FROM 
            Documents 
        WHERE 
            Location = @Location
    END
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Read_Documents')
    DROP PROCEDURE [dbo].[mw_Read_Documents]
GO

CREATE PROCEDURE [dbo].[mw_Read_Documents] 
(
    @ParentID nvarchar(64) = NULL
)
AS
BEGIN 
	SET NOCOUNT ON
	
	IF @ParentID IS NOT NULL
	BEGIN
	    SELECT 
            ID,
            ParentID,
            Title,
            Location
        FROM 
            Documents 
        WHERE 
            ID != @ParentID
        AND
            ParentID = @ParentID
        ORDER BY 
            Title
    END
    ELSE
    BEGIN
        SELECT 
            ID,
            ParentID,
            Title,
            Location
        FROM 
            Documents
        ORDER BY 
            Title
    END
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Search_Documents')
    DROP PROCEDURE [dbo].[mw_Search_Documents]
GO

CREATE PROCEDURE [dbo].[mw_Search_Documents] 
(
    @Query nvarchar(255)
)
AS
BEGIN 
	SET NOCOUNT ON
	
    SELECT 
        ID,
        ParentID,
        Title,
        Body,
        Location
    FROM 
        Documents 
    WHERE 
		Title LIKE '%' + @Query + '%'
    OR
        Body LIKE '%' + @Query + '%'
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Delete_Document')
    DROP PROCEDURE [dbo].[mw_Delete_Document]
GO

CREATE PROCEDURE [dbo].[mw_Delete_Document] 
(
    @ID nvarchar(64),
    @Username nvarchar(128)
)
AS
BEGIN 
	SET NOCOUNT ON

    -- Use a recursive CTE to get all ancestors of the deleted page
    ;WITH Tree AS (
        SELECT *
        FROM Documents dp
        WHERE dp.ID = @ID
        UNION ALL
        SELECT dc.*
        FROM Documents dc
        JOIN Tree ON dc.ParentID = Tree.ID
    )
	INSERT INTO DeletedDocuments 
	    (ID, ParentID, Title, Body, Slug, Location, Username, TOC, Created, Updated, Deleted)
    SELECT
        ID,
        ParentID,
        Title,
        Body,
        Slug,
        Location,
        @Username,
        TOC,
        Created,
        Updated,
        GETDATE()
    FROM
        Tree
    
	;WITH Tree AS (
        SELECT *
        FROM Documents dp
        WHERE dp.ID = @ID
        UNION ALL
        SELECT dc.*
        FROM Documents dc
        JOIN Tree ON dc.ParentID = Tree.ID
    )
    DELETE 
        Documents
    FROM 
        Tree
    WHERE 
        Documents.ID = Tree.ID
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Get_Breadcrumb_Trail')
    DROP PROCEDURE [dbo].[mw_Get_Breadcrumb_Trail]
GO

CREATE PROCEDURE [dbo].[mw_Get_Breadcrumb_Trail] 
(
    @ID nvarchar(64)
)
AS
BEGIN 
	SET NOCOUNT ON

	DECLARE @Documents TABLE (
		Idx int NOT NULL,
		ID nvarchar(64) NOT NULL, 
        ParentID nvarchar(64) NOT NULL, 
        Title nvarchar(128) NOT NULL, 
        Location nvarchar(256) NULL
	)

	INSERT INTO @Documents 
		(ID, ParentID, Title, Location, Idx)
	SELECT 
		ID, ParentID, Title, Location, 0
	FROM 
		Documents WHERE ID = @ID

	DECLARE @CurrentID nvarchar(64)
	DECLARE @ParentID nvarchar(64)
	DECLARE @Idx int = 1
	
	SELECT @ParentID = ParentID, @CurrentID = ID FROM @Documents WHERE ID = @ID

	WHILE (@ParentID != @CurrentID)
	BEGIN
		INSERT INTO @Documents 
			(ID, ParentID, Title, Location, Idx)
		SELECT 
			ID, ParentID, Title, Location, @Idx
		FROM 
			Documents WHERE ID = @ParentID

		SELECT @ParentID = ParentID, @CurrentID = ID FROM @Documents WHERE ID = @ParentID
		SET @Idx = @Idx + 1
	END

    DECLARE @Result nvarchar(512) = STUFF((SELECT CAST('|' AS NVARCHAR(1)) + CAST(ISNULL(d.Title, '') AS VARCHAR(128)) + '^' + CAST(ISNULL(d.Location, '') AS VARCHAR(256))
				                    FROM @Documents d  
				                    WHERE d.ID <> '1'
				                    ORDER BY d.Idx DESC             
				                    FOR XML PATH(''), TYPE).value('(./text())[1]','VARCHAR(MAX)'), 1, 1, '')

	SELECT @Result
END	
GO

USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Check_File_Use')
    DROP PROCEDURE [dbo].[mw_Check_File_Use]
GO

CREATE PROCEDURE [dbo].[mw_Check_File_Use] 
(
    @Location nvarchar(512)
)
AS
BEGIN 
	SET NOCOUNT ON

	SELECT 
        ID,
        Title,
        Location
    FROM 
        Documents 
    WHERE
        Body LIKE '%' + @Location + '%'
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