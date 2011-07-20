CREATE TABLE [Documents] ([ID] nvarchar(128) NOT NULL, [Location] nvarchar(256) NOT NULL, [Created] datetime NOT NULL, [LastEdited] datetime NOT NULL, [Body] ntext NULL);
ALTER TABLE [Documents] ADD CONSTRAINT [PK_Documents] PRIMARY KEY ([ID]);
INSERT INTO [Documents] ([ID], [Location], [Created], [LastEdited], [Body]) VALUES ('@@GUID@@', 'root', '@@NOW@@', '@@NOW@@', '# Welcome to MicroWiki!');