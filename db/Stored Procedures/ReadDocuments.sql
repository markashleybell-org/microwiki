
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
