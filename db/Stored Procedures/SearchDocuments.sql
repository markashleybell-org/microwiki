
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

    IF @Query IS NOT NULL
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

    IF (SELECT COUNT(*) FROM @Tags) > 0
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

    IF (SELECT COUNT(*) FROM @TagResults) = 0
    BEGIN
        -- Straight LIKE query
        INSERT INTO @SearchResults
        SELECT ID FROM @QueryResults
    END
    ELSE IF (SELECT COUNT(*) FROM @QueryResults) = 0
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
