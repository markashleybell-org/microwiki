
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
        ),
        d.IsPublic
    FROM
        Documents d
    INNER JOIN
        @SearchResults sr ON sr.ID = d.ID
END
