-- The changes will be: table HTML, images, and code blocks

-- Find code blocks with our custom syntax
-- select * from Documents where Body LIKE '%<!-- lang%'

INSERT INTO
    [microwiki].dbo.Documents (
        ID,
        ParentID,
        Title,
        Body,
        Slug,
        [Location],
        TOC,
        Username,
        Created,
        Updated
    )
SELECT
    ID,
    ParentID,
    Title,
    Body,
    Slug,
    [Location],
    TOC,
    Username,
    Created,
    Updated
FROM
    [microwiki-current].dbo.Documents