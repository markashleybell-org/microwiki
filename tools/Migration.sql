UPDATE Documents SET ParentID = NULL WHERE ID = '3c93fc3c-832c-40b7-9a2c-6ff89f1f406a'

UPDATE Documents SET Body = REPLACE(Body, '/UserContent/', '/usercontent/')

-- Seeded dev password is 'test123'
INSERT INTO Users (ID, Email, [Password])
VALUES ('e5754cce-838b-4446-ada8-2d5a6e057555', 'me@markb.co.uk', 'AQAAAAEAACcQAAAAEBLK+6fu54twYNDSevf5lzx8y0AsLgIABI9cfdPh/lV8W/k2hHvRCxh0p2TTcrKiPA==')
