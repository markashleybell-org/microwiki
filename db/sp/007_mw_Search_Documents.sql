USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Search_Documents')
    DROP PROCEDURE [dbo].[mw_Search_Documents]
GO

CREATE PROCEDURE [dbo].[mw_Search_Documents] 
(
    @Query nvarchar(255)
)
AS
BEGIN 
	SET NOCOUNT ON
	
    SELECT 
        ID,
        ParentID,
        Title,
        Body,
        Location
    FROM 
        Documents 
    WHERE 
		Title LIKE '%' + @Query + '%'
    OR
        Body LIKE '%' + @Query + '%'
END	
GO

