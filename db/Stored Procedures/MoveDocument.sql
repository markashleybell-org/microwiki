
CREATE PROCEDURE [dbo].[MoveDocument] 
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Username NVARCHAR(128)
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
