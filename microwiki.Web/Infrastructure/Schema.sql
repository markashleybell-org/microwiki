CREATE TABLE [Documents] ([Location] nvarchar(256) NOT NULL, [Created] datetime NOT NULL, [LastEdited] datetime NOT NULL, [Body] ntext NULL);
ALTER TABLE [Documents] ADD CONSTRAINT [PK_Documents] PRIMARY KEY ([Location]);
INSERT INTO [Documents] ([Location], [Created], [LastEdited], [Body]) VALUES ('root', '@@NOW@@', '@@NOW@@', 'Welcome to MicroWiki!');