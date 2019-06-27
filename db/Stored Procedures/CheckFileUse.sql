﻿
CREATE PROCEDURE [dbo].[CheckFileUse] 
(
    @Location nvarchar(512)
)
AS
BEGIN 
	SET NOCOUNT ON

	SELECT 
        ID,
        Title,
        Location
    FROM 
        Documents 
    WHERE
        Body LIKE '%' + @Location + '%'
END	