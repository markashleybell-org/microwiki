USE [MicroWiki]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME = 'mw_Update_Document_Locations')
    DROP PROCEDURE [dbo].[mw_Update_Document_Locations]
GO

CREATE PROCEDURE [dbo].[mw_Update_Document_Locations] 
AS
BEGIN 
	SET NOCOUNT ON
	BEGIN TRY
		BEGIN TRAN	
			-- Insert all documents into a temporary table
			SELECT ID, ParentID, Slug, Location INTO #Documents FROM Documents
			-- Find the root/home document
			DECLARE @RootID nvarchar(64) = (SELECT ID FROM #Documents WHERE ParentID = ID)
			-- NULL out all Location fields
			UPDATE #Documents SET Location = NULL
			-- Update root/home document location specifically
			UPDATE #Documents SET Location = '/' WHERE ID = @RootID
			-- Update location for any children of the root/home document
			UPDATE #Documents SET Location = '/' + ISNULL(Slug, '') WHERE ParentID = @RootID
			-- Figure out how many documents still have an empty Location field
			DECLARE @Empty INT = (SELECT COUNT(*) FROM #Documents WHERE Location IS NULL)
			-- U
			WHILE (@Empty > 0)
			BEGIN
				UPDATE doc
				SET doc.Location = parent.Location + '/' + ISNULL(doc.Slug, '')
				FROM #Documents doc
				INNER JOIN #Documents parent ON parent.ID = doc.ParentID
				WHERE doc.ParentID != @RootID
				SET @Empty = (SELECT COUNT(*) FROM #Documents WHERE Location IS NULL)
				IF @Empty = 0 BREAK
			END

			UPDATE doc
			SET Location = tmp.Location
			FROM Documents doc
			INNER JOIN #Documents tmp ON doc.ID = tmp.ID
		COMMIT TRAN
		RETURN 0		
	END TRY
	BEGIN CATCH
		SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage, ERROR_LINE() AS ErrorLine
		IF(@@TRANCOUNT>0) ROLLBACK TRAN	
		RETURN -1	
	END CATCH	
END	
GO

