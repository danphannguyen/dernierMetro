#Dernier Metro

Storytelling et contexte (script)
- "Imaginez Lina, 00:58, elle sort d'un concert a Chatelet. Elle doit prendre la ligne 1. A-t-elle le temps d'attraper le **dernier metro** ?"
- "Nous allons construire une petite API qui repond en quelques millisecondes avec la prochaine rame et si c'est la derniere. Pas de donnees temps reel: on simule des horaires pour se concentrer sur les fondamentaux backend et la containerisation."

## Étape 1
Le server.js demarre sans erreur sur un port configurable. 
1) Pour changer de port vous pouvez modifier la variable `PORT` dans le fichier .env
2) Ensuite pour tester il vous suffit de lancer un `npm run start` et vérifier si à l'url `http://localhost:3000/` vous obtenez vien une erreur 404 (status:	"URL not found")

## Étape 2
Testing des différentes routes, executez les commandes `curl` suivantes **dans un nouveau terminal** : 
- **/health** : `curl -i http://localhost:3000/health` 
- **/next-metro** : `curl -i http://localhost:3000/next-metro?station=arts-et-metiers`

En parrallèle vous pouvez vérifier dans votre console que les logs s'affichent bel et bien, exemple : 
- `GET /health 200 25ms`
- `GET / 404 4ms` 

## Étape 3
Testing du swagger






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



