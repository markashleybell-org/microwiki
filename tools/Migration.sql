UPDATE Documents SET ParentID = NULL WHERE ID = '3c93fc3c-832c-40b7-9a2c-6ff89f1f406a'

UPDATE Documents SET Body = REPLACE(Body, '/UserContent/', '/usercontent/')
