DECLARE @User SYSNAME = N'USER_NAME'

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = @User)
BEGIN
    -- Grant execute/select on stored procedures, functions and UDTs

    DECLARE @ObjectName SYSNAME
    DECLARE @ObjectType NVARCHAR(40)

    DECLARE UserDefinedObjects CURSOR FOR
    SELECT 
        ROUTINE_NAME AS ObjectName,
        ROUTINE_TYPE AS ObjectType
    FROM 
        INFORMATION_SCHEMA.ROUTINES
    WHERE 
        ROUTINE_TYPE = 'PROCEDURE'
    OR
        ROUTINE_TYPE = 'FUNCTION'
    UNION ALL
    SELECT 
        name AS ObjectName,
        'USER_DEFINED_TABLE_TYPE' AS ObjectType
    FROM 
        sys.types 
    WHERE 
        is_user_defined = 1
    AND
        is_table_type = 1
    ORDER BY
        ObjectType,
        ObjectName

    OPEN UserDefinedObjects

    FETCH NEXT FROM UserDefinedObjects INTO @ObjectName, @ObjectType

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF (@ObjectType = 'USER_DEFINED_TABLE_TYPE')
        BEGIN
            EXEC('GRANT EXECUTE ON TYPE::' + @ObjectName + ' TO [' + @User + ']')
            PRINT 'EXECUTE granted for ' + @User + ' on ' + @ObjectName
        END
        ELSE
        BEGIN
            -- We need to do this slightly odd dance because some SQL function
            -- types require SELECT permissions, while others require EXECUTE
            BEGIN TRY
                EXEC('GRANT EXECUTE ON ' + @ObjectName + ' TO [' + @User + ']')
                PRINT 'EXECUTE granted for ' + @User + ' on ' + @ObjectName
            END TRY
            BEGIN CATCH
                EXEC('GRANT SELECT ON ' + @ObjectName + ' TO [' + @User + ']')
                PRINT 'SELECT granted for ' + @User + ' on ' + @ObjectName
            END CATCH
        END

        FETCH NEXT FROM UserDefinedObjects INTO @ObjectName, @ObjectType
    END

    CLOSE UserDefinedObjects
    DEALLOCATE UserDefinedObjects
END
GO
