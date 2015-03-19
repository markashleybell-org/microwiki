USE [master]
GO

IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'MicroWiki')
BEGIN
	DECLARE @kill varchar(8000) = '';
	SELECT @kill = @kill + 'kill ' + CONVERT(varchar(5), spid) + ';'
	FROM master..sysprocesses 
	WHERE dbid = db_id('MicroWiki')
	EXEC(@kill)
	DROP DATABASE [MicroWiki]
END
GO

CREATE DATABASE [MicroWiki]
GO

