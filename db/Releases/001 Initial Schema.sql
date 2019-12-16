CREATE TYPE [dbo].[GuidList] AS TABLE (
    [ID] UNIQUEIDENTIFIER
)
GO

CREATE TYPE [dbo].[TagList] AS TABLE (
    [Label] VARCHAR(64)
)
GO

CREATE TABLE [dbo].[DeletedDocuments] (
    [ID]       UNIQUEIDENTIFIER  NOT NULL,
    [ParentID] UNIQUEIDENTIFIER  CONSTRAINT [DF_DeletedDocuments_ParentID] DEFAULT ('home') NOT NULL,
    [Title]    NVARCHAR (128) NOT NULL,
    [Body]     NVARCHAR (MAX) NULL,
    [Slug]     NVARCHAR (256) NULL,
    [Location] NVARCHAR (256) NULL,
    [Username] NVARCHAR (128) NOT NULL,
    [Tags]     NVARCHAR(1024) NULL,
    [Created]  DATETIME       CONSTRAINT [DF_DeletedDocuments_Created] DEFAULT (getdate()) NOT NULL,
    [Updated]  DATETIME       CONSTRAINT [DF_DeletedDocuments_Updated] DEFAULT (getdate()) NOT NULL,
    [Deleted]  DATETIME       CONSTRAINT [DF_DeletedDocuments_Deleted] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_DeletedDocuments] PRIMARY KEY CLUSTERED ([ID] ASC)
)
GO

CREATE TABLE [dbo].[Documents] (
    [ID]       UNIQUEIDENTIFIER  NOT NULL,
    [ParentID] UNIQUEIDENTIFIER   NULL,
    [Title]    NVARCHAR (128) NOT NULL,
    [Body]     NVARCHAR (MAX) NULL,
    [Slug]     NVARCHAR (256) NULL,
    [Location] NVARCHAR (256) NULL,
    [Username] NVARCHAR (128) NOT NULL,
    [Created]  DATETIME       CONSTRAINT [DF_Documents_Created] DEFAULT (getdate()) NOT NULL,
    [Updated]  DATETIME       CONSTRAINT [DF_Documents_Updated] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_Documents] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Documents_Documents] FOREIGN KEY ([ParentID]) REFERENCES [dbo].[Documents] ([ID])
)
GO

CREATE TABLE [dbo].[Tags] (
    [ID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [Label] NVARCHAR(64) NOT NULL
)
GO

CREATE TABLE [dbo].[Tags_Documents] (
    [TagID] UNIQUEIDENTIFIER NOT NULL,
    [DocumentID] UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY ([TagID], [DocumentID]),
    CONSTRAINT [FK_Tags_Documents_Tags] FOREIGN KEY ([TagID]) REFERENCES [Tags]([ID]),
    CONSTRAINT [FK_Tags_Documents_Documents] FOREIGN KEY ([DocumentID]) REFERENCES [Documents]([ID])
)
GO

CREATE TABLE [dbo].[Users] (
    [ID]       UNIQUEIDENTIFIER NOT NULL,
    [Email]    NVARCHAR (256)  NOT NULL,
    [Password] NVARCHAR (2048) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([ID] ASC)
)
GO

CREATE PROCEDURE [dbo].[UpdateDocumentLocations]
AS
BEGIN
    SET NOCOUNT ON
    BEGIN TRY
        BEGIN TRAN

            -- Insert all documents into a temporary table
            SELECT ID, ParentID, Slug, Location INTO #Documents FROM Documents

            -- Find the root/home document
            DECLARE @RootID UNIQUEIDENTIFIER = (SELECT ID FROM #Documents WHERE ParentID IS NULL)

            -- NULL out all Location fields
            UPDATE #Documents SET Location = NULL

            -- Update root/home document location specifically
            UPDATE #Documents SET Location = '/' WHERE ID = @RootID

            -- Update location for any children of the root/home document
            UPDATE #Documents SET Location = '/' + ISNULL(Slug, '') WHERE ParentID = @RootID

            -- Figure out how many documents still have an empty Location field
            DECLARE @Empty INT = (SELECT COUNT(*) FROM #Documents WHERE Location IS NULL)

            WHILE (@Empty > 0)
            BEGIN
                UPDATE
                    doc
                SET
                    doc.Location = parent.Location + '/' + ISNULL(doc.Slug, '')
                FROM
                    #Documents doc
                INNER JOIN
                    #Documents parent ON parent.ID = doc.ParentID
                WHERE
                    doc.ParentID != @RootID

                SET @Empty = (SELECT COUNT(*) FROM #Documents WHERE Location IS NULL)

                IF @Empty = 0
                    BREAK
            END

            UPDATE
                doc
            SET
                Location = tmp.Location
            FROM
                Documents doc
            INNER JOIN
                #Documents tmp ON doc.ID = tmp.ID

        COMMIT TRAN

        RETURN 0
    END TRY
    BEGIN CATCH
        SELECT
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_LINE() AS ErrorLine

        IF(@@TRANCOUNT > 0)
            ROLLBACK TRAN

        RETURN -1
    END CATCH
END
GO

CREATE PROCEDURE [dbo].[UpdateTags]
(
    @DocumentID UNIQUEIDENTIFIER,
    @Tags [dbo].[TagList] READONLY
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @TagsToLink TABLE (
        TagID UNIQUEIDENTIFIER,
        [Label] NVARCHAR(64)
    )

    DECLARE @NewTagData TABLE (
        TagID UNIQUEIDENTIFIER,
        [Label] NVARCHAR(64)
    )

    -- For any tags which were passed in that already exist, use the current record
    INSERT INTO
        @TagsToLink (
            TagID,
            [Label]
        )
    SELECT
        t.ID,
        t.[Label]
    FROM
        Tags t
    INNER JOIN
        @Tags dt ON dt.[Label] = t.Label

    -- Create tag records for any new tags (those which aren't already in @TagsToLink)
    INSERT INTO
        @NewTagData (
            TagID,
            [Label]
        )
    SELECT
        NEWID() AS TagID,
        [Label]
    FROM
        @Tags t
    WHERE
        NOT EXISTS (SELECT * FROM @TagsToLink WHERE [Label] = t.[Label])

    INSERT INTO
        Tags (
            ID,
            [Label]
        )
    SELECT
        TagID,
        [Label]
    FROM
        @NewTagData

    -- Add the newly-created tag data to the update table
    INSERT INTO
        @TagsToLink (
            TagID,
            [Label]
        )
    SELECT
        TagID,
        [Label]
    FROM
        @NewTagData

    -- Delete all existing tag joins (some tags may have been deleted)
    DELETE FROM
        Tags_Documents
    WHERE
        DocumentID = @DocumentID

    -- Re-add joins for all existing and new tags
    INSERT INTO
        Tags_Documents (
            TagID,
            DocumentID
        )
    SELECT
        TagID,
        @DocumentID
    FROM
        @TagsToLink
END
GO

CREATE PROCEDURE [dbo].[CheckFileUse]
(
    @Location NVARCHAR(512)
)
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        ID,
        ParentID,
        Title,
        Location
    FROM
        Documents
    WHERE
        Body LIKE '%' + @Location + '%'
END
GO

CREATE PROCEDURE [dbo].[CreateDocument]
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Title NVARCHAR(128),
    @Body NVARCHAR(max),
    @Slug NVARCHAR(256),
    @Username NVARCHAR(128),
    @Tags [dbo].[TagList] READONLY
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @RandomSlug NVARCHAR(5)

    WHILE EXISTS (SELECT * FROM Documents WHERE Slug = @Slug)
    BEGIN
        SET @RandomSlug = (SELECT LOWER(LEFT(NEWID(), 5)))
        SET @Slug = @Slug + '-' + @RandomSlug
    END

    INSERT INTO
        Documents (
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Username
        )
    VALUES (
        @ID,
        @ParentID,
        @Title,
        @Body,
        @Slug,
        @Username
    )

    EXEC UpdateDocumentLocations

    EXEC UpdateTags @ID, @Tags

    SELECT Location FROM Documents WHERE ID = @ID
END
GO

CREATE PROCEDURE [dbo].[DeleteDocument]
(
    @ID UNIQUEIDENTIFIER,
    @Username NVARCHAR(128)
)
AS
BEGIN
    SET NOCOUNT ON

    -- Use a recursive CTE to get all ancestors of the deleted page
    ;WITH Tree AS (
        SELECT
            *
        FROM
            Documents dp
        WHERE
            dp.ID = @ID
        UNION ALL
        SELECT
            dc.*
        FROM
            Documents dc
        JOIN
            Tree ON dc.ParentID = Tree.ID
    )
    SELECT
        *
    INTO
        #DocumentsToDelete
    FROM
        Tree

    INSERT INTO
        DeletedDocuments (
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            Username,
            Tags,
            Created,
            Updated,
            Deleted
        )
    SELECT
        ID,
        ParentID,
        Title,
        Body,
        Slug,
        Location,
        @Username,
        Tags,
        Created,
        Updated,
        GETDATE()
    FROM
        #DocumentsToDelete

    DELETE
        t
    FROM
        Tags_Documents t
    INNER JOIN
        #DocumentsToDelete del ON del.ID = t.DocumentID

    DELETE
        d
    FROM
        Documents d
    INNER JOIN
        #DocumentsToDelete del ON del.ID = d.ID
END
GO

CREATE PROCEDURE [dbo].[GetBreadcrumbTrail]
(
    @ID UNIQUEIDENTIFIER
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @Documents TABLE (
        Idx INT NOT NULL,
        ID UNIQUEIDENTIFIER NOT NULL,
        ParentID UNIQUEIDENTIFIER NULL,
        Title NVARCHAR(128) NOT NULL,
        Location NVARCHAR(256) NULL
    )

    INSERT INTO
        @Documents (
            ID,
            ParentID,
            Title,
            Location,
            Idx
        )
    SELECT
        ID,
        ParentID,
        CASE WHEN ParentID IS NULL THEN 'Home' ELSE Title END,
        CASE WHEN ID = @ID THEN NULL ELSE Location END,
        0
    FROM
        Documents
    WHERE
        ID = @ID

    DECLARE @CurrentID UNIQUEIDENTIFIER
    DECLARE @ParentID UNIQUEIDENTIFIER
    DECLARE @Idx int = 1

    SELECT
        @ParentID = ParentID,
        @CurrentID = ID
    FROM
        @Documents
    WHERE
        ID = @ID

    WHILE (@ParentID IS NOT NULL AND @ParentID != @CurrentID)
    BEGIN
        INSERT INTO
            @Documents (
                ID,
                ParentID,
                Title,
                Location,
                Idx
            )
        SELECT
            ID,
            ParentID,
            CASE WHEN ParentID IS NULL THEN 'Home' ELSE Title END,
            CASE WHEN ID = @ID THEN NULL ELSE Location END,
            @Idx
        FROM
            Documents
        WHERE
            ID = @ParentID

        SELECT
            @ParentID = ParentID,
            @CurrentID = ID
        FROM
            @Documents
        WHERE
            ID = @ParentID

        SET @Idx = @Idx + 1
    END

    SELECT
        Title,
        Location
    FROM
        @Documents
    ORDER BY
        Idx DESC
END
GO

CREATE PROCEDURE [dbo].[MergeTags]
(
    @TagID UNIQUEIDENTIFIER,
    @TagIdsToMerge [dbo].[GuidList] READONLY
)
AS
BEGIN
    SET NOCOUNT ON

    BEGIN TRY
        BEGIN TRAN
            -- Update any references to tags we're merging to point to the merge target tag
            UPDATE
                td
            SET
                td.TagID = @TagID
            FROM
                Tags_Documents td
            INNER JOIN
                @TagIdsToMerge m ON m.ID = td.TagID
            WHERE NOT EXISTS (
                -- If there is already a relationship between this document and the merge target,
                -- we need to ignore it, otherwise we'll attempt to add a duplicate
                SELECT * FROM Tags_Documents c WHERE c.TagID = @TagID and c.DocumentID = td.DocumentID
            )

            -- Clean up any join records referencing merged tags which didn't get updated above
            DELETE
                td
            FROM
                Tags_Documents td
            INNER JOIN
                @TagIdsToMerge m ON m.ID = td.TagID

            -- Delete the original tag records
            DELETE
                t
            FROM
                Tags t
            INNER JOIN
                @TagIdsToMerge m ON m.ID = t.ID
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        IF(@@TRANCOUNT > 0)
            ROLLBACK TRAN;

        THROW;
    END CATCH
END
GO

CREATE PROCEDURE [dbo].[MoveDocument]
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Username NVARCHAR(128)
)
AS
BEGIN
    SET NOCOUNT ON

    UPDATE
        Documents
    SET
        ParentID = @ParentID,
        Username = @Username,
        Updated = GETDATE()
    WHERE
        ID = @ID

    EXEC UpdateDocumentLocations

    SELECT
        Location
    FROM
        Documents
    WHERE
        ID = @ID
END
GO

CREATE PROCEDURE [dbo].[ReadDocument]
(
    @ID UNIQUEIDENTIFIER = NULL,
    @Location NVARCHAR(256) = NULL
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @Document TABLE (
        [ID]       UNIQUEIDENTIFIER  NOT NULL,
        [ParentID] UNIQUEIDENTIFIER   NULL,
        [Title]    NVARCHAR (128) NOT NULL,
        [Body]     NVARCHAR (MAX) NULL,
        [Slug]     NVARCHAR (256) NULL,
        [Location] NVARCHAR (256) NULL,
        [Tags]     NVARCHAR(1024) NULL,
        [Username] NVARCHAR (128) NOT NULL,
        [Created]  DATETIME NOT NULL,
        [Updated]  DATETIME NOT NULL
    )

    IF @ID IS NOT NULL
    BEGIN
        INSERT INTO
            @Document
        SELECT
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            NULL,
            Username,
            Created,
            Updated
        FROM
            Documents
        WHERE
            ID = @ID
    END
    ELSE IF @Location IS NOT NULL
    BEGIN
        INSERT INTO
            @Document
        SELECT
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            NULL,
            Username,
            Created,
            Updated
        FROM
            Documents
        WHERE
            Location = @Location
    END

    UPDATE
        doc
    SET
        Tags = (
            SELECT STUFF((
                SELECT
                    '|' + [Label]
                FROM
                    Tags
                INNER JOIN
                    Tags_Documents ON Tags_Documents.TagID = Tags.ID
                WHERE
                    Tags_Documents.DocumentID = doc.ID
                FOR XML PATH ('')
            ), 1, 1, '')
        )
    FROM
        @Document doc

    SELECT * FROM @Document
END
GO

CREATE PROCEDURE [dbo].[ReadDocuments]
(
    @ParentID UNIQUEIDENTIFIER = NULL
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

CREATE PROCEDURE [dbo].[SearchDocuments]
(
    @Query NVARCHAR(255),
    @Tags [dbo].[TagList] READONLY
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @QueryResults [dbo].[GuidList]
    DECLARE @TagResults [dbo].[GuidList]

    DECLARE @SearchResults [dbo].[GuidList]

    DECLARE @QuerySpecified BIT = CASE WHEN @Query IS NOT NULL THEN 1 ELSE 0 END
    DECLARE @TagsSpecified BIT = CASE WHEN (SELECT COUNT(*) FROM @Tags) > 0 THEN 1 ELSE 0 END

    IF @QuerySpecified = 1
    BEGIN
        INSERT INTO
            @QueryResults
        SELECT
            d.ID
        FROM
            Documents d
        WHERE
            d.Title LIKE '%' + @Query + '%'
        OR
            d.Body LIKE '%' + @Query + '%'
    END

    IF @TagsSpecified = 1
    BEGIN
        INSERT INTO
            @TagResults
        SELECT
            td.DocumentID
        FROM
            Tags_Documents td
        INNER JOIN
            Tags t ON t.ID = td.TagID
        WHERE
            t.[Label] IN (SELECT [Label] FROM @Tags)
    END

    IF @TagsSpecified = 0
    BEGIN
        -- Straight LIKE query
        INSERT INTO @SearchResults
        SELECT ID FROM @QueryResults
    END
    ELSE IF @QuerySpecified = 0
    BEGIN
        -- Tag-only query
        INSERT INTO @SearchResults
        SELECT ID FROM @TagResults
    END
    ELSE
    BEGIN
        -- Results must exist in *both* datasets
        INSERT INTO @SearchResults
        SELECT ID FROM @QueryResults
        INTERSECT
        SELECT ID FROM @TagResults
    END

    SELECT
        d.ID,
        d.Title,
        d.Body,
        d.Location,
        Tags = (
            SELECT STUFF((
                SELECT
                    '|' + [Label]
                FROM
                    Tags
                INNER JOIN
                    Tags_Documents ON Tags_Documents.TagID = Tags.ID
                WHERE
                    Tags_Documents.DocumentID = d.ID
                FOR XML PATH ('')
            ), 1, 1, '')
        )
    FROM
        Documents d
    INNER JOIN
        @SearchResults sr ON sr.ID = d.ID
END
GO

CREATE PROCEDURE [dbo].[UpdateDocument]
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Title NVARCHAR(128),
    @Body NVARCHAR(max),
    @Slug NVARCHAR(256),
    @Username NVARCHAR(128),
    @Tags [dbo].[TagList] READONLY
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @RandomSlug NVARCHAR(5)

    WHILE EXISTS (SELECT * FROM Documents WHERE Slug = @Slug AND ID != @ID)
    BEGIN
        SET @RandomSlug = (SELECT LOWER(LEFT(NEWID(), 5)))
        SET @Slug = @Slug + '-' + @RandomSlug
    END

    UPDATE
        Documents
    SET
        ParentID = @ParentID,
        Title = @Title,
        Body = @Body,
        Slug = @Slug,
        Username = @Username,
        Updated = GETDATE()
    WHERE
        ID = @ID

    EXEC UpdateDocumentLocations

    EXEC UpdateTags @ID, @Tags
END
GO
