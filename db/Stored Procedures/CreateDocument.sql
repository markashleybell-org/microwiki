
CREATE PROCEDURE [dbo].[CreateDocument] 
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
	
	WHILE EXISTS (SELECT * FROM Documents WHERE Slug = @Slug)
	BEGIN
	    SET @RandomSlug = (SELECT LOWER(LEFT(NEWID(), 5)))
	    SET @Slug = @Slug + '-' + @RandomSlug
	END
	
	INSERT INTO Documents 
	    (ID, ParentID, Title, Body, Slug, Username, TOC)
    VALUES 
        (@ID, @ParentID, @Title, @Body, @Slug, @Username, @TOC)
        
    EXEC UpdateDocumentLocations
    
    SELECT Location FROM Documents WHERE ID = @ID
END	
