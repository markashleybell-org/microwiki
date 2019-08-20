
CREATE PROCEDURE [dbo].[UpdateDocument] 
(
    @ID UNIQUEIDENTIFIER,
    @ParentID UNIQUEIDENTIFIER,
    @Title NVARCHAR(128),
    @Body NVARCHAR(max),
    @Slug NVARCHAR(256),
    @Username NVARCHAR(128),
    @TOC BIT
)
AS
BEGIN 
	SET NOCOUNT ON
	
	DECLARE @RandomSlug NVARCHAR(5)
	
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
END	
