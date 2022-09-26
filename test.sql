connect to cs348;

CREATE TABLE player
(
        pnum DECIMAL(9, 0) NOT NULL PRIMARY KEY,
        name VARCHAR(30)
);

SELECT * FROM player
WHERE pnum = 1;
