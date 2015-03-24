USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Check_File_Use')
    DROP PROCEDURE [dbo].[mw_Check_File_Use]
GO

CREATE PROCEDURE [dbo].[mw_Check_File_Use] 
(
    @Location nvarchar(512)
)
AS
BEGIN 
	SET NOCOUNT ON

	SELECT 
        ID,
        Title
    FROM 
        Documents 
    WHERE
        Body LIKE '%' + @Location + '%'
END	
GO

