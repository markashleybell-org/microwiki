-- Update display tags fields in link records after tag association added/removed
CREATE TRIGGER [UpdateDisplayTags]
ON Tags_Documents
FOR INSERT, DELETE
AS
BEGIN
    DECLARE @Delete BIT = CASE WHEN (SELECT COUNT(*) FROM DELETED) > 0 THEN 1 ELSE 0 END
    DECLARE @Insert BIT = CASE WHEN (SELECT COUNT(*) FROM INSERTED) > 0 THEN 1 ELSE 0 END

    DECLARE @DocumentID UNIQUEIDENTIFIER = CASE 
        WHEN @Delete = 1 THEN (SELECT TOP 1 DocumentID FROM DELETED) 
        ELSE (SELECT TOP 1 DocumentID FROM INSERTED) 
    END

	UPDATE 
		Documents 
	SET 
		Tags = (
			SELECT STUFF((
                SELECT 
                    '|' + [Label]
				FROM 
                    Tags
				INNER JOIN 
                    Tags_Documents ON Tags_Documents.TagID = Tags.ID
				WHERE 
                    Tags_Documents.DocumentID = @DocumentID
				FOR XML PATH ('')
            ), 1, 1, '') 
		) 
	WHERE 
		ID = @DocumentID
END
GO
