USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Delete_Document')
    DROP PROCEDURE [dbo].[mw_Delete_Document]
GO

CREATE PROCEDURE [dbo].[mw_Delete_Document] 
(
    @ID nvarchar(64),
    @Username nvarchar(128)
)
AS
BEGIN 
	SET NOCOUNT ON
	
	INSERT INTO DeletedDocuments 
	    (ID, ParentID, Title, Body, Slug, Location, Username, Created, Updated, Deleted)
    SELECT
        ID,
        ParentID,
        Title,
        Body,
        Slug,
        Location,
        @Username,
        Created,
        Updated,
        GETDATE()
    FROM
        Documents 
    WHERE
        ID = @ID
       
    DELETE FROM Documents WHERE ID = @ID
END	
GO

