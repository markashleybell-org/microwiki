USE [MicroWiki]
GO

DECLARE @RootID nvarchar(128) = LOWER(NEWID())

INSERT INTO [Documents] 
    ([ID], [ParentID], [Title], [Body], [Location], [Username])
VALUES 
    (@RootID, @RootID, 'Welcome to MicroWiki!', 'You can [Edit](/wiki/update/' + @RootID + ') this page now, or [Add Child Pages](/wiki/create/' + @RootID + ').', '/', 'SYSTEM');
GO

SELECT * FROM [Documents]
GO

