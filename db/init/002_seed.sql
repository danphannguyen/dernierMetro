-- Seed values for Dernier Metro API
-- Safe to re-run: upserts on conflict

INSERT INTO public.config(key, value) VALUES
  ('app.name',       '{"service":"dernier-metro-api"}'),
  ('metro.defaults', '{"line":"M1","headwayMin":3,"tz":"Europe/Paris"}'),
  -- Stations seeding
  ('metro.last', '{
    "Châtelet": "00:47",
    "Bastille": "00:45",
    "La Défense": "00:40",
    "Nation": "00:42",
    "Concorde": "00:43",
    "Gare de Lyon": "00:46",
    "Porte Maillot": "00:39",
    "Château de Vincennes": "00:44"
  }')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.stations (name, lines) VALUES
  ('Abbesses', ARRAY['12']),
  ('Alésia', ARRAY['4']),
  ('Anvers', ARRAY['2']),
  ('Argentine', ARRAY['1']),
  ('Arts et Métiers', ARRAY['3', '11']),
  ('Assemblée Nationale', ARRAY['12']),
  ('Pyramides', ARRAY['7', '14']),
  ('Porte de Clignancourt', ARRAY['13']),
  ('Porte de la Chapelle', ARRAY['12']),
  ('Porte de Vincennes', ARRAY['1']),
  ('Porte Maillot', ARRAY['1']),
  ('Porte Saint-Denis', ARRAY['4']),
  ('Porte Saint-Martin', ARRAY['3']),
  ('Porte de la Villette', ARRAY['7']),
  ('Porte d''Orléans', ARRAY['4']),
  ('Porte d''Aubervilliers', ARRAY['12']),
  ('Porte de Montreuil', ARRAY['9']),
  ('Porte de Saint-Ouen', ARRAY['13']);

UPDATE public.stations
SET slug = LOWER(
              regexp_replace(
                  unaccent(name),  -- supprime les accents
                  '[\s'']+',       -- espace ou apostrophe
                  '-',             -- remplace par tiret
                  'g'
              )
          );