
CREATE PROCEDURE [dbo].[CreateDocument] 
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
