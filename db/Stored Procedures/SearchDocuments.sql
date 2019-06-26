
CREATE PROCEDURE [dbo].[SearchDocuments] 
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
