
CREATE PROCEDURE [dbo].[GetBreadcrumbTrail] 
(
    @ID UNIQUEIDENTIFIER
)
AS
BEGIN 
	SET NOCOUNT ON

	DECLARE @Documents TABLE (
		Idx INT NOT NULL,
		ID UNIQUEIDENTIFIER NOT NULL, 
        ParentID UNIQUEIDENTIFIER NOT NULL, 
        Title NVARCHAR(128) NOT NULL, 
        Location NVARCHAR(256) NULL
	)

	INSERT INTO @Documents 
		(ID, ParentID, Title, Location, Idx)
	SELECT 
		ID, ParentID, Title, Location, 0
	FROM 
		Documents WHERE ID = @ID

	DECLARE @CurrentID UNIQUEIDENTIFIER
	DECLARE @ParentID UNIQUEIDENTIFIER
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

    DECLARE @Result nvarchar(512) = STUFF((SELECT CAST('|' AS NVARCHAR(1)) + CAST(ISNULL(d.Title, '') AS VARCHAR(128)) + '^' + CAST(ISNULL(d.Location, '') AS VARCHAR(256))
				                    FROM @Documents d  
				                    WHERE d.ID <> '1'
				                    ORDER BY d.Idx DESC             
				                    FOR XML PATH(''), TYPE).value('(./text())[1]','VARCHAR(MAX)'), 1, 1, '')

	SELECT @Result
END	
