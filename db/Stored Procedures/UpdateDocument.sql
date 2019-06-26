
CREATE PROCEDURE [dbo].[UpdateDocument] 
(
    @ID nvarchar(64),
    @ParentID nvarchar(64),
    @Title nvarchar(128),
    @Body nvarchar(max),
    @Slug nvarchar(256),
    @Username nvarchar(128),
    @TOC bit
)
AS
BEGIN 
	SET NOCOUNT ON
	
	DECLARE @RandomSlug nvarchar(5)
	
	WHILE EXISTS (SELECT * FROM Documents WHERE Slug = @Slug AND ID != @ID)
	BEGIN
	    SET @RandomSlug = (SELECT LOWER(LEFT(NEWID(), 5)))
	    SET @Slug = @Slug + '-' + @RandomSlug
	END
	
	UPDATE Documents SET 
	    ParentID = @ParentID, 
	    Title = @Title, 
	    Body = @Body, 
	    Slug = @Slug, 
	    Username = @Username,
	    TOC = @TOC,
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
