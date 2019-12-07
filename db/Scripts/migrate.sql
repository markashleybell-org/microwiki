-- The changes will be: table HTML, images, and code blocks

-- Find code blocks with our custom syntax
-- select * from Documents where Body LIKE '%<!-- lang%'

BEGIN TRAN

IF OBJECT_ID(N'tempdb..#Tags') IS NOT NULL
    DROP TABLE #Tags

SELECT
    ID AS OldID,
    NEWID() AS ID,
    REPLACE(TagContent, ' ', '-') AS Label
INTO
    #Tags
FROM
    [microwiki-current].[dbo].[Tags]

INSERT INTO [microwiki].[dbo].[Tags] (
    ID,
    Label
)
SELECT 
    ID,
    LOWER(Label)
FROM
    #Tags

INSERT INTO [microwiki].[dbo].[Documents] (
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
)
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
    [microwiki-current].[dbo].[Documents]

INSERT INTO [microwiki].[dbo].[Tags_Documents] (
    TagID,
    DocumentID
)
SELECT
    new.ID,
    old.DocumentID
FROM
    [microwiki-current].[dbo].[Documents_Tags] old
INNER JOIN
    #Tags new ON new.OldID = old.TagID

DROP TABLE #Tags

UPDATE [microwiki].[dbo].[Documents] SET ParentID = NULL WHERE ID = '3c93fc3c-832c-40b7-9a2c-6ff89f1f406a'

UPDATE [microwiki].[dbo].[Documents] SET Body = REPLACE(Body, '/UserContent/', '/usercontent/')

-- Seeded dev password is 'test123'
INSERT INTO [microwiki].[dbo].[Users] (ID, Email, [Password])
VALUES ('e5754cce-838b-4446-ada8-2d5a6e057555', 'me@markb.co.uk', 'AQAAAAEAACcQAAAAEBLK+6fu54twYNDSevf5lzx8y0AsLgIABI9cfdPh/lV8W/k2hHvRCxh0p2TTcrKiPA==')

-- ROLLBACK TRAN; DROP TABLE #Tags
COMMIT TRAN
