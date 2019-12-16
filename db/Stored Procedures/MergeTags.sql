
CREATE PROCEDURE [dbo].[MergeTags]
(
    @TagID UNIQUEIDENTIFIER,
    @TagIdsToMerge [dbo].[GuidList] READONLY
)
AS
BEGIN
    SET NOCOUNT ON

    BEGIN TRY
        BEGIN TRAN
            -- Update any references to tags we're merging to point to the merge target tag
            UPDATE
                td
            SET
                td.TagID = @TagID
            FROM
                Tags_Documents td
            INNER JOIN
                @TagIdsToMerge m ON m.ID = td.TagID
            WHERE NOT EXISTS (
                -- If there is already a relationship between this document and the merge target,
                -- we need to ignore it, otherwise we'll attempt to add a duplicate
                SELECT * FROM Tags_Documents c WHERE c.TagID = @TagID and c.DocumentID = td.DocumentID
            )

            -- Clean up any join records referencing merged tags which didn't get updated above
            DELETE
                td
            FROM
                Tags_Documents td
            INNER JOIN
                @TagIdsToMerge m ON m.ID = td.TagID

            -- Delete the original tag records
            DELETE
                t
            FROM
                Tags t
            INNER JOIN
                @TagIdsToMerge m ON m.ID = t.ID
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        IF(@@TRANCOUNT > 0)
            ROLLBACK TRAN;

        THROW;
    END CATCH
END
