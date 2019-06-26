
CREATE PROCEDURE [dbo].[MoveDocument] 
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
        
    EXEC UpdateDocumentLocations
    
    SELECT 
        Location 
    FROM 
        Documents 
    WHERE 
        ID = @ID
END	
