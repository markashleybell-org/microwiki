
CREATE PROCEDURE [dbo].[SearchDocuments] 
(
    @Query nvarchar(255)
)
AS
BEGIN 
	SET NOCOUNT ON
	
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
    WHERE 
		d.Title LIKE '%' + @Query + '%'
    OR
        d.Body LIKE '%' + @Query + '%'
END	
