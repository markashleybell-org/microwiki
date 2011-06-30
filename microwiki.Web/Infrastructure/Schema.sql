﻿CREATE TABLE [Documents] ([Location] nvarchar(256) NOT NULL, [Title] nvarchar(4000) NULL, [Created] datetime NOT NULL, [LastEdited] datetime NOT NULL, [Body] ntext NULL);
ALTER TABLE [Documents] ADD CONSTRAINT [PK_Documents] PRIMARY KEY ([Location]);
INSERT INTO [Documents] ([Location], [Title], [Created], [LastEdited], [Body]) VALUES ('/', 'Home Page', '@@NOW@@', '@@NOW@@', 'Welcome to MicroWiki!');