
CREATE PROCEDURE [dbo].[ReadDocumentsForSearchIndex]
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        ID,
        ParentID,
        Title,
        Body,
        Slug,
        Location,
        CAST(NULL AS NVARCHAR(1024)) AS Tags,
        Username,
        Created,
        Updated,
        IsPublic
    INTO
        #AllDocuments
    FROM
        Documents

    UPDATE
        docs
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
                    Tags_Documents.DocumentID = docs.ID
                FOR XML PATH ('')
            ), 1, 1, '')
        )
    FROM
        #AllDocuments docs

    SELECT * FROM #AllDocuments
END
