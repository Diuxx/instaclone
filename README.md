# CloneInsta

Clone insta est une application développée lors du module "Full stack" 2020-2021 durant ma dernière année de master. 

Elle utilise les technologies angular et nodejs, pour le stockage des données nous utilisons sqlite.


Elle met en pratique:
- l'authentification via firebase
- l'appel d'api rest (services)
- le templating (angular)
- l'asynchrone 
- La détection d'actions en temps réel
- la mise en place de base de donnée no sql (sqlite)

## Installation

Pour installer cloneInsta, il vous faut vous positionner respectivement dans les répertoires "front" et "back" et effectuer la commande suivante :

```bash
npm i
```

un fois cela fait, faites dans les deux répertoire "front" et "back" :

```bash
npm start
```

l'url du front : http://localhost:4200

l'url du back permettant d'accéder aux endpoints : http://localhost:3001

l'url de socketio afin de diffuser des messages au personne connectées : http://localhost:3000