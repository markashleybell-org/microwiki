
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
        Created,
        Updated,
        GETDATE()
    FROM
        Tree
    
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
    DELETE 
        Documents
    FROM 
        Tree
    WHERE 
        Documents.ID = Tree.ID
END	
