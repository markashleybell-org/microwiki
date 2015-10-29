USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Create_Document')
    DROP PROCEDURE [dbo].[mw_Create_Document]
GO

CREATE PROCEDURE [dbo].[mw_Create_Document] 
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
        
    EXEC mw_Update_Document_Locations
    
    SELECT Location FROM Documents WHERE ID = @ID
END	
GO

