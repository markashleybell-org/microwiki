ALTER PROCEDURE [dbo].[CheckFileUse]
(
    @Location NVARCHAR(512)
)
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        ID,
        ParentID,
        Title,
        Location,
        IsPublic
    FROM
        Documents
    WHERE
        Body LIKE '%' + @Location + '%'
END
GO
