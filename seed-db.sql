USE microwiki
GO

TRUNCATE TABLE [DeletedDocuments]
TRUNCATE TABLE [Documents]
GO

DECLARE @RootID UNIQUEIDENTIFIER = NEWID()

INSERT INTO [Documents] 
    ([ID], [ParentID], [Title], [Body], [Location], [Username])
VALUES 
    (@RootID, @RootID, 'Welcome to MicroWiki!', 'You can [Edit](/wiki/update/' + CONVERT(NVARCHAR(64), @RootID) + ') this page now, or [Add Child Pages](/wiki/create/' + CONVERT(NVARCHAR(64), @RootID) + ').', '/', 'SYSTEM');
GO

SELECT * FROM [Documents]
GO
