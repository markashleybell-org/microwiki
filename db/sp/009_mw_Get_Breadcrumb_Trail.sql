USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Get_Breadcrumb_Trail')
    DROP PROCEDURE [dbo].[mw_Get_Breadcrumb_Trail]
GO

CREATE PROCEDURE [dbo].[mw_Get_Breadcrumb_Trail] 
(
    @ID nvarchar(64)
)
AS
BEGIN 
	SET NOCOUNT ON

	DECLARE @Documents TABLE (
		Idx int NOT NULL,
		ID nvarchar(64) NOT NULL, 
        ParentID nvarchar(64) NOT NULL, 
        Title nvarchar(128) NOT NULL, 
        Location nvarchar(256) NULL
	)

	INSERT INTO @Documents 
		(ID, ParentID, Title, Location, Idx)
	SELECT 
		ID, ParentID, Title, Location, 0
	FROM 
		Documents WHERE ID = @ID

	DECLARE @CurrentID nvarchar(64)
	DECLARE @ParentID nvarchar(64)
	DECLARE @Idx int = 1
	
	SELECT @ParentID = ParentID, @CurrentID = ID FROM @Documents WHERE ID = @ID

	WHILE (@ParentID != @CurrentID)
	BEGIN
		INSERT INTO @Documents 
			(ID, ParentID, Title, Location, Idx)
		SELECT 
			ID, ParentID, Title, Location, @Idx
		FROM 
			Documents WHERE ID = @ParentID

		SELECT @ParentID = ParentID, @CurrentID = ID FROM @Documents WHERE ID = @ParentID
		SET @Idx = @Idx + 1
	END

	SELECT STUFF((SELECT CAST('|' AS NVARCHAR(1)) + CAST(ISNULL(d.Title, '') AS VARCHAR(128)) + '^' + CAST(ISNULL(d.Location, '') AS VARCHAR(256))
				  FROM @Documents d  
				  WHERE d.ID <> '1'
				  ORDER BY d.Idx DESC             
				  FOR XML PATH('')), 1, 1, '')
END	
GO

