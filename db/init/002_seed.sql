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
