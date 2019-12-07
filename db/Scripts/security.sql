DECLARE @User SYSNAME = N'USER_NAME'

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = @User)
BEGIN

    DECLARE @RoutineName sysname

    DECLARE Routines CURSOR FOR
    SELECT ROUTINE_NAME
    FROM 
        INFORMATION_SCHEMA.ROUTINES
    WHERE 
        ROUTINE_NAME NOT LIKE '%diagram%'
    ORDER BY 
        ROUTINE_TYPE, 
        ROUTINE_NAME

    OPEN Routines

    FETCH NEXT FROM Routines INTO @RoutineName

    WHILE @@FETCH_STATUS = 0
    BEGIN
        BEGIN TRY
            EXEC('GRANT EXECUTE ON ' + @RoutineName + ' TO [' + @User + ']')
            PRINT 'Granting EXECUTE for ' + @RoutineName
        END TRY
        BEGIN CATCH
            EXEC('GRANT SELECT ON ' + @RoutineName + ' TO [' + @User + ']')
            PRINT 'Granting SELECT for ' + @RoutineName
        END CATCH

        FETCH NEXT FROM Routines INTO @RoutineName
    END

    CLOSE Routines
    DEALLOCATE Routines
    
END
GO