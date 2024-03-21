-- migrate:up
CREATE TABLE qnas (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);


-- migrate:down
DROP TABLE qnas;
