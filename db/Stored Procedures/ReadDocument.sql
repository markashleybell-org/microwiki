
CREATE PROCEDURE [dbo].[ReadDocument]
(
    @ID UNIQUEIDENTIFIER = NULL,
    @Location NVARCHAR(256) = NULL
)
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @Document TABLE (
        [ID]       UNIQUEIDENTIFIER  NOT NULL,
        [ParentID] UNIQUEIDENTIFIER   NULL,
        [Title]    NVARCHAR (128) NOT NULL,
        [Body]     NVARCHAR (MAX) NULL,
        [Slug]     NVARCHAR (256) NULL,
        [Location] NVARCHAR (256) NULL,
        [Tags]     NVARCHAR(1024) NULL,
        [Username] NVARCHAR (128) NOT NULL,
        [Created]  DATETIME NOT NULL,
        [Updated]  DATETIME NOT NULL
    )

    IF @ID IS NOT NULL
    BEGIN
        INSERT INTO
            @Document
        SELECT
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            NULL,
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
        INSERT INTO
            @Document
        SELECT
            ID,
            ParentID,
            Title,
            Body,
            Slug,
            Location,
            NULL,
            Username,
            Created,
            Updated
        FROM
            Documents
        WHERE
            Location = @Location
    END

    UPDATE
        doc
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
                    Tags_Documents.DocumentID = doc.ID
                FOR XML PATH ('')
            ), 1, 1, '')
        )
    FROM
        @Document doc

    SELECT * FROM @Document
END
