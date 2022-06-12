# EcoDroide

EcoDroide est un bot Discord français pour les serveurs souhaitants mettre en place un petit système d'économie.

La base de données utilise mongoose, ainsi que le framework [sheweny](https://sheweny.js.org/) afin de simplifier son utilisation et les modifications pour les utilisateurs.

## Comment l'installer

1. Cloner la repo.
2. Renommer le fichier `config.template.js` — il est situé dans `src/structures` — en `config.js` et mettre vos tokens.
3. Installer les dépendences : `npm install`.
4. Démarrer le bot : `node .\src\index.js`.