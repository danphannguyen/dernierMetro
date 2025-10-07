-- Activer l'extension pour gérer les accents
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS public.config (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

-- Table des stations (avec lignes de métro)
CREATE TABLE IF NOT EXISTS public.stations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  lines TEXT[] NOT NULL,
  slug TEXT UNIQUE
);

-- Table des fréquences de passage (headways)
CREATE TABLE IF NOT EXISTS public.headways (
  id SERIAL PRIMARY KEY,
  station_id INTEGER NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  minutes INTEGER NOT NULL CHECK (minutes > 0)
);

-- Table du dernier métro
CREATE TABLE IF NOT EXISTS public.last_metro (
  id SERIAL PRIMARY KEY,
  station_id INTEGER UNIQUE NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  departed_at TIME NOT NULL
);
