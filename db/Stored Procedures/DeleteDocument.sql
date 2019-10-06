
CREATE PROCEDURE [dbo].[DeleteDocument] 
(
    @ID UNIQUEIDENTIFIER,
    @Username NVARCHAR(128)
)
AS
BEGIN 
	SET NOCOUNT ON

    -- Use a recursive CTE to get all ancestors of the deleted page
    ;WITH Tree AS (
        SELECT 
            *
        FROM 
            Documents dp
        WHERE 
            dp.ID = @ID
        UNION ALL
        SELECT 
            dc.*
        FROM 
            Documents dc
        JOIN 
            Tree ON dc.ParentID = Tree.ID
    )
    SELECT
        *
    INTO
        #DocumentsToDelete
    FROM
        Tree

	INSERT INTO 
        DeletedDocuments (
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            Username,
            TOC,
            Tags,
            Created,
            Updated,
            Deleted
        )
    SELECT
        ID,
        ParentID,
        Title,
        Body,
        Slug,
        Location,
        @Username,
        TOC,
        Tags,
        Created,
        Updated,
        GETDATE()
    FROM
        #DocumentsToDelete

    DELETE 
        t
    FROM 
        Tags_Documents t
    INNER JOIN
        #DocumentsToDelete del ON del.ID = t.DocumentID

    DELETE 
        d
    FROM 
        Documents d
    INNER JOIN
        #DocumentsToDelete del ON del.ID = d.ID
END	
