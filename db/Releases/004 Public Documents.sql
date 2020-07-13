IF COL_LENGTH('[dbo].[Documents]', 'IsPublic') IS NULL
BEGIN
    ALTER TABLE [dbo].[Documents]
	ADD [IsPublic] BIT NOT NULL DEFAULT 0
END
GO

ALTER PROCEDURE [dbo].[CreateDocument]
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Title NVARCHAR(128),
    @Body NVARCHAR(max),
    @Slug NVARCHAR(256),
    @Username NVARCHAR(128),
    @Tags [dbo].[TagList] READONLY,
    @IsPublic BIT
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
            Username,
            IsPublic
        )
    VALUES (
        @ID,
        @ParentID,
        @Title,
        @Body,
        @Slug,
        @Username,
        @IsPublic
    )

    EXEC UpdateDocumentLocations

    EXEC UpdateTags @ID, @Tags

    SELECT Location FROM Documents WHERE ID = @ID
END

GO

ALTER PROCEDURE [dbo].[ReadDocument]
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
        [Updated]  DATETIME NOT NULL,
        [IsPublic] BIT NOT NULL
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
            Updated,
            IsPublic
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
            Updated,
            IsPublic
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

ALTER PROCEDURE [dbo].[ReadDocuments]
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
            Location,
            IsPublic
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
            Location,
            IsPublic
        FROM
            Documents
        ORDER BY
            Title
    END
END

GO

ALTER PROCEDURE [dbo].[SearchDocuments]
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
        ),
        d.IsPublic
    FROM
        Documents d
    INNER JOIN
        @SearchResults sr ON sr.ID = d.ID
END

GO

ALTER PROCEDURE [dbo].[UpdateDocument]
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Title NVARCHAR(128),
    @Body NVARCHAR(max),
    @Slug NVARCHAR(256),
    @Username NVARCHAR(128),
    @Tags [dbo].[TagList] READONLY,
    @IsPublic BIT
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
        Updated = GETDATE(),
        IsPublic = @IsPublic
    WHERE
        ID = @ID

    EXEC UpdateDocumentLocations

    EXEC UpdateTags @ID, @Tags
END

GO