#Dernier Metro

Storytelling et contexte (script)
- "Imaginez Lina, 00:58, elle sort d'un concert a Chatelet. Elle doit prendre la ligne 1. A-t-elle le temps d'attraper le **dernier metro** ?"
- "Nous allons construire une petite API qui repond en quelques millisecondes avec la prochaine rame et si c'est la derniere. Pas de donnees temps reel: on simule des horaires pour se concentrer sur les fondamentaux backend et la containerisation."

## Environnement
Le server.js demarre sans erreur sur un port configurable. 
1) Pour changer de port vous pouvez modifier la variable `PORT` dans le fichier .env (n'oubliez pas de changer aussi le port dans le openapi.yaml)
2) Ensuite pour tester il vous suffit de lancer un `docker compose up` et vérifier si à l'url `http://localhost:3000/` vous obtenez vien une erreur 404 (status:	"URL not found")

## API
Testing des différentes routes, executez les commandes `curl` suivantes **dans un nouveau terminal** : 
- **/health/api** : `curl -i http://localhost:3000/health/api` 
- **/health/db** : `curl -i http://localhost:3000/health/db` 
- **/next-metro** : `curl -i "http://localhost:3000/next-metro?station=arts-et-metiers"`

Défi B + C — [Challenge bonus](https://teams.microsoft.com/l/message/19:meeting_ZjgyYjI4ODgtYjYzOS00MTA5LWE0MzYtZmVlZTRkMDk1NmU0@thread.v2/1758025194336?context=%7B%22contextType%22%3A%22chat%22%7D)
- **/next-metro** :
  - `curl -i "http://localhost:3000/next-metro?station=arts-et-metiers&n=3"`
  - `curl -i "http://localhost:3000/next-metro?station=ARTS%20ET%20METIERS&n=3"`
  ou directement dans votre navigateur (le curl ne supporte pas bien les caractères avec des accents) : 
  - `http://localhost:3000/next-metro?station=Arts%20et%20Métiers&n=3`
  - `http://localhost:3000/next-metro?station=arts et metiers&n=3`

En parrallèle vous pouvez vérifier dans votre console que les logs s'affichent bel et bien, exemple : 
- `GET /health/api 200 25ms`
- `GET / 404 4ms` 

## Swagger
Vous pouvez vous rendre sur `http://localhost:8080/` et vous verez l'interface de swagger UI avec les routes qui ont été défini dans le fichier `openapi/openapi.yaml`


## Adminer
Rendez vous sur `http://localhost:8081/` pour voir l'interface `adminer` qui sera votre interface pour gérer votre BDD PostgreSQL à l'instar d'un PHPMyAdmin.

Système	: `PostgreSQL`
Serveur	: `db` (nom de votre service postgresql dans le docker-compose)
Utilisateur	: à définir et réutiliser dans votre .env via exemple -> `POSTGRES_USER=myuser`
Mot de passe : à définir et réutiliser dans votre .env via exemple -> `POSTGRES_PASSWORD=supersecret`
Base de données	: à définir et réutiliser dans votre .env via exemple -> `POSTGRES_DB=derniermetro`

## Database 
Lister les tables : 
```bash
docker compose exec db psql -U myuser  -d derniermetro -c "\dt"
```

Vérifier les stationss : 
```bash
docker compose exec postgres psql -U app -d dernier_metro -c "SELECT * FROM stations;"
```

⚠️ Les tables :
- `headways(id, station_id, minutes>0)` : Fréquence de passage (en minutes)
- `last_metro(id, station_id UNIQUE, departed_at TIME)` : Heure de départ du dernier métro

Sont remplacée par ces variables dans le .env (Défi A — [Challenge bonus](https://teams.microsoft.com/l/message/19:meeting_ZjgyYjI4ODgtYjYzOS00MTA5LWE0MzYtZmVlZTRkMDk1NmU0@thread.v2/1758025194336?context=%7B%22contextType%22%3A%22chat%22%7D)):
```
HEADWAY_MIN=5
LAST_WINDOW_START=12:45
SERVICE_END=15:25
```

## Test unitaire et d'intégration
Pour cela après avoir lancé vos container via `docker compose up`,
il suffit d'éxecuter la commande suivante : 
`docker compose exec api npm run test`













## Étape Bonus 1
Dans votre .env vous pouvez spécifier de nouvelles variables, exemple : 
`HEADWAY_MIN=5` Elle permettra de set l'intervale entre les horaires
`LAST_WINDOW_START=12:45` Elle permettra de set l'heure de début 
`SERVICE_END=1:15` Elle permettra de set l'heure de fin

## Étape Bonus 2
Lors de la requête à **/next-metro** vous pouvez ajouter un nombre d'horaire (max 5) sous la forme d'un query params "n" : 
`curl -i http://localhost:3000/next-metro?station=arts-et-metiers&n=2`

## Étape Bonus 3
Selon les statiosn référencer dans le fichier `src/data/paris_metro_stations.json` des suggestions sont possible : 
- `curl -i http://localhost:3000/next-metro?station=arts`
- `curl -i http://localhost:3000/next-metro?station=ar`



