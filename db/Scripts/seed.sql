USE microwiki
GO

DELETE FROM [Tags_Documents]
DELETE FROM [Tags]
DELETE FROM [DeletedDocuments]
DELETE FROM [Documents]
GO

-- Seeded dev password is 'test123'
INSERT INTO [microwiki].[dbo].[Users] (ID, Email, [Password])
VALUES ('e5754cce-838b-4446-ada8-2d5a6e057555', 'me@markb.co.uk', 'AQAAAAEAACcQAAAAEBLK+6fu54twYNDSevf5lzx8y0AsLgIABI9cfdPh/lV8W/k2hHvRCxh0p2TTcrKiPA==')
GO

DECLARE @RootID UNIQUEIDENTIFIER = NEWID()

INSERT INTO [Documents]
    ([ID], [ParentID], [Title], [Body], [Location], [Username])
VALUES
    (@RootID, NULL, 'Welcome to MicroWiki!', 'You can [Edit](/wiki/update/' + CONVERT(NVARCHAR(64), @RootID) + ') this page now, or [Add a Child Page](/wiki/create?parentID=' + CONVERT(NVARCHAR(64), @RootID) + ').', '/', 'SYSTEM');
GO

SELECT * FROM [Documents]
GO
