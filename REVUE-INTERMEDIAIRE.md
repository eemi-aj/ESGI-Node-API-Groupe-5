- Aucun commit d'Arnaud n'a été trouvé dans le dépôt => contributions à vérifier
- /!\ je ne peux pas exécuter mes tests automatisés (https://github.com/adrienjoly/ava-tests-for-note-keeper) sur votre serveur car ma requête sur "POST /signup" retourne une erreur 500. (erreur interne) => merci de corriger votre API en relisant le cahier des charges: https://adrienjoly.com/cours-nodejs/05-proj/

```sh
$ curl -X POST --header "Content-Type: application/json" --data '{
        "username": "username",
        "password": "pwdd"
    }' http://localhost:3000/signup

<h1>Cannot read property &#39;length&#39; of undefined</h1>
<h2></h2>
<pre>TypeError: Cannot read property &#39;length&#39; of undefined
    at /usr/src/app/routes/signup.js:16:25
    at Layer.handle [as handle_request] (/usr/src/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/usr/src/app/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/usr/src/app/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/usr/src/app/node_modules/express/lib/router/layer.js:95:5)
    at /usr/src/app/node_modules/express/lib/router/index.js:281:22
    at Function.process_params (/usr/src/app/node_modules/express/lib/router/index.js:335:12)
    at next (/usr/src/app/node_modules/express/lib/router/index.js:275:10)
    at Function.handle (/usr/src/app/node_modules/express/lib/router/index.js:174:3)
    at router (/usr/src/app/node_modules/express/lib/router/index.js:47:12)</pre>
```
