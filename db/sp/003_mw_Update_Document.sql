USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Update_Document')
    DROP PROCEDURE [dbo].[mw_Update_Document]
GO

CREATE PROCEDURE [dbo].[mw_Update_Document] 
(
    @ID nvarchar(64),
    @ParentID nvarchar(64),
    @Title nvarchar(128),
    @Body nvarchar(max),
    @Slug nvarchar(256),
    @Username nvarchar(128)
)
AS
BEGIN 
	SET NOCOUNT ON
	
	UPDATE Documents SET 
	    ParentID = @ParentID, 
	    Title = @Title, 
	    Body = @Body, 
	    Slug = @Slug, 
	    Username = @Username,
	    Updated = GETDATE()
    WHERE 
        ID = @ID
            
    EXEC mw_Update_Document_Locations
    
    SELECT 
        Location 
    FROM 
        Documents 
    WHERE 
        ID = @ID
END	
GO

