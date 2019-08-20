
CREATE PROCEDURE [dbo].[ReadDocument] 
(
    @ID UNIQUEIDENTIFIER = NULL,
    @Location NVARCHAR(256) = NULL
)
AS
BEGIN 
	SET NOCOUNT ON
	
	IF @ID IS NOT NULL
	BEGIN
	    SELECT 
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            TOC,
            Username,
            Created, 
            Updated
        FROM 
            Documents 
        WHERE 
            ID = @ID
    END
    ELSE IF @Location IS NOT NULL
    BEGIN
	    SELECT 
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            TOC,
            Username,
            Created, 
            Updated
        FROM 
            Documents 
        WHERE 
            Location = @Location
    END
END	
