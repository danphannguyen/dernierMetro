INSERT INTO config (key, value)
VALUES ('Arts et Métiers', '{"headway":3}')
ON CONFLICT (key) DO NOTHING;


