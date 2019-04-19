# ESGI-NodeJS-Project

Ce projet correspond à une API de gestion de notes.

## Installation
Pour modifier l'api en fonction de vos besoins :

Cloner la repository git :

```git clone https://github.com/Nicolas199818/ESGI-NodeJS-Project.git```

Afin de pouvoir tester, vous pouvez utilisez docker pour la base de données mongodb.

Etape 1 : Télécharger l'image docker mongodb

```docker pull mongo:4```

Etape 2 : Exécuter le serveur mongodb

```docker run --rm --publish 27017:27017 --name nodejs-ex-2-1 mongo:4```

Etape 3 : installer les dépendances

```npm-install```

Etape 4 : Configurer les variables d'environnement avec vos données:

```process.env.MONGODB_URI```
```process.env.JWT_KEY```
```process.env.PORT```

## Lancer le programme :

```npm start```

##Comment vérifier le bon lancement de l'application ?

Aller dans le navigateur et entrer l'URL suivante :

```http://localhost:3000/```

3000 correspond au port par défaut. Sinon entrer la valeur que vous avez entré dans process.env.PORT.
