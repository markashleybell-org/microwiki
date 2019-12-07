USE microwiki
GO

DELETE FROM [Tags_Documents]
DELETE FROM [Tags]
DELETE FROM [DeletedDocuments]
DELETE FROM [Documents]
GO

DECLARE @RootID UNIQUEIDENTIFIER = NEWID()

INSERT INTO [Documents] 
    ([ID], [ParentID], [Title], [Body], [Location], [Username])
VALUES 
    (@RootID, NULL, 'Welcome to MicroWiki!', 'You can [Edit](/wiki/update/' + CONVERT(NVARCHAR(64), @RootID) + ') this page now, or [Add a Child Page](/wiki/create?parentID=' + CONVERT(NVARCHAR(64), @RootID) + ').', '/', 'SYSTEM');
GO

SELECT * FROM [Documents]
GO
