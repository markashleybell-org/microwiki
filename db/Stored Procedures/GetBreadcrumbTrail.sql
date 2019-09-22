
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
        ParentID UNIQUEIDENTIFIER NULL, 
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

	WHILE (@ParentID IS NOT NULL AND @ParentID != @CurrentID)
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

    SELECT Title, Location FROM @Documents ORDER BY Idx DESC
END	
