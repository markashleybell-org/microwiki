
CREATE PROCEDURE [dbo].[UpdateTags] 
(
    @DocumentID UNIQUEIDENTIFIER,
    @Tags [dbo].[TagList] READONLY
)
AS
BEGIN 
	SET NOCOUNT ON

    DECLARE @TagsToLink TABLE (TagID UNIQUEIDENTIFIER, [Label] NVARCHAR(64))

    DECLARE @NewTagData TABLE (TagID UNIQUEIDENTIFIER, [Label] NVARCHAR(64))

    -- For any tags which were passed in that already exist, use the current record
    INSERT INTO @TagsToLink (TagID, [Label]) 
    SELECT t.ID, t.[Label] FROM Tags t INNER JOIN @Tags dt ON dt.[Label] = t.Label

    -- Create tag records for any new tags (those which aren't already in @TagsToLink)
    INSERT INTO @NewTagData (TagID, [Label])
    SELECT NEWID() AS TagID, [Label] FROM @Tags t 
    WHERE NOT EXISTS (SELECT * FROM @TagsToLink WHERE [Label] = t.[Label])

    INSERT INTO Tags (ID, [Label])
    SELECT TagID, [Label] FROM @NewTagData

    -- Add the newly-created tag data to the update table
    INSERT INTO @TagsToLink (TagID, [Label]) 
    SELECT TagID, [Label] FROM @NewTagData

    -- Delete all existing tag joins (some tags may have been deleted)
    DELETE FROM Tags_Documents WHERE DocumentID = @DocumentID

    -- Re-add joins for all existing and new tags
    INSERT INTO Tags_Documents (TagID, DocumentID)
    SELECT TagID, @DocumentID FROM @TagsToLink
END
