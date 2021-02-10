# La Taverne des Soiffards

## Démarrage du projet

Afin de pouvoir utiliser le projet, il vous faudra d'abord cloner le dépôt distant sur votre machine. Ensuite, il est impératif de créer un fichier `.env` à la racine de chacun des deux dossiers `back-end`et `front-end`. Voici le contenu à écrire dans chacun des fichiers :

Back-end .env :
```bash
PORT=9092
MONGO_URI=http://localhost:27017/tds
JWT_SECRET=(le secret pour la génération du token web json)
CLIENT_URI=http://localhost:3000
ADMIN_TITLE=(le nom que vous souhaitez donner au titre de votre admin)
APP_NAME=TAVERNE-DES-SOIFFARDS
GOOGLE_ACCOUNT=(votre adresse e-mail google)
GOOGLE_APP_PASSWORD=(le mot de passe d\'application pour cet e-mail. )
```
Plus de détails concernant la manière de générer un mot de passe d'application pour votre compte Google [ici](https://www.lifewire.com/get-a-password-to-access-gmail-by-pop-imap-2-1171882).

Front-end .env :
```bash
APP_NAME=TAVERNE-DES-SOIFFARDS
REACT_APP_API_URI=http://localhost:9092/tds
```

Une fois ces fichiers créés, il faudra ouvrir deux fenêtres dans votre terminal, et exécuter les commandes suivantes une fois positionné à l'endroit où vous avez cloné les dossiers :
```bash
cd back-end
npm install
npm start
```

Puis
```bash
cd front-end
npm install
npm start
```

## Explication du projet

Ceci est le dernier projet ç réaliser pour valider la formation de reconversion que j'ai entamée en juin 2020. 
L'idée était pour moi de développer des compétences que je ne maîtrisais pas, et que je n'avais pas eu l'occasion de voir au cours de la formation, à savoir l'utilisation de React, de Mongoose pour la connection à une base de données (pas nécessaire, mais vu un peu partout, donc utile à connaître).

Egalement, je souhaitais profiter de l'opportunité que représente la réalisation de ce projet pour mettre en pratique ce que j'ai appris durant mon stage en entreprise, en particulier concernant la structuration d'un projet.

En effet, bien structurer son projet (de même que suvire [les règles de bonnes pratiques](https://www.zeolearn.com/magazine/nodejs-best-practices) pour les projets NodeJS) est essentielle à la bonne compréhension et la maintenabilité dans le temps de ce dernier.

### Pourquoi ce nom ?

J'ai décidé que j'allais utiliser ce projet non seulement pour valider ma formation, mais également pour approfondir mes connaissances de la programmation et offrir à ma guilde (des joueurs avec lesquels je joue en ligne) une plateforme sociale permettant de se retrouver pour discuter stratégie, s'envoyer des messages pour programmer les sessions de jeu, ou simplement tchater ensemble. L'idée était de fournir à ma guilde une plateforme dédiée pour se retrouver entre deux sessions de jeu.

Notre guilde s'appelant "La Taverne des Soiffards" et faisant déjà référence à un lieu de rencontre et de discussion, il m'est apparu qu'il était tout à fait possible de conserver ce nom pour nommer cette plateforme.

L'origine du nom vient du fait que nous nous sommes rencontrés sur le jeu [Sea of Thieves](https://www.seaofthieves.com/fr) (_Microsoft and Rare All Rights reserverd_), un jeu de piraterie en ligne. Les pirates étant réputés, dans l'imaginaire collectif, pour leur addiction au rhum, l'un de nos membres fondateurs, Damarolo, a eu l'idée de nommer notre guilde La Taverne des Soiffards. Ce nom est depuis resté, et tous les membres l'ont adopté !

> _Disclaimer: ce site n'a en aucun cas l'intention, directe ou indirecte, de faire la promotion de l'alcolisme, de tout comportement déviant lié à l'alcool ou de toute boisson alcolisée quelle que soit sa forme_

## Utilisation de la plateforme

### Création d'un compte

Bravo ! Vous venez de rejoindre la guilde, et on vous a donné le lien vers La Taverne des Soiffards ! Afin d'accéder à toutes les fonctionnalités offertes par le site (_i.e_ une page de profil, un tchat en direct avec les autres membres, etc) il vous faut tout d'abord créer un compte. Pour cela, il vous suffit de cliquer sur le lien "Créer un compte" et de renseigner au moins un pseudonyme (qui sera visible par les autres utilisateurs) ainsi qu'un mot de passe et une adresse e-mail (qui sera utilisée pour recevoir les communications de la guilde ainsi que récupérer votre mot de passe en cas d'oubli de ce dernier). Une fois votre compte créé, vous pourrez accéder à la plateforme et commencer à participer avec les autres membres aux différentes activités organisées.

### Gestion du profil

Dans votre page de profil, vous pourrez modifier les informations relatives à votre compte, à savoir votre mot de passe, vos nom et prénom, l'adresse e-mail liée à votre compte, votre photo de profil, etc. 

### Publication de messages

Vous aurez la possibilité, une fois connecté, d'envoyer des publications (pouvant contenir une image) qui seront visibles depuis l'ongle "Messages" du menu de navigation. Tous les messages de tous les utilisateurs seront recensés sur cette page.

### Tchat en direct

Dans la Taverne, vous serez connecté avec tous les utilisateurs présents et pourrez échanger sans temps de rechargement avec eux, comme sur n'importe quelle plateforme de réseau social.

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
                                 LES BUGS (mais pas Bunny...)
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

# Principaux bugs rencontrés lors du développement du projet :

## Problème 0 : Photo de profil n'apparaît (résolu)
Lors de la mise à jour du profil d'un utilisateur, les informations relatives à la photo de profil sont bien envoyées au back end (visibles dans la bdd) mais ne s'affichent pas dans le profil de l'utilisateur.

### Update problème 0

Le problème venait du fait que j'avais oublié que j'avais appelé la variable d'environnement de liaison à l'API back end "APP_REACT_API_URI" et j'avais écrit "APP_REACT_API_URL", comme un gros couillon...

----------------------------------------------

## Problème 1 : Bio n'apparaît pas (résolu)

Lors de la mise à jour du profil d'un utilisateur, les informations relatives à la description de l'utilisateur (sa bio) sont bien envoyées au back end (visibles dans la bdd) mais ne s'affichent pas dans le profil de l'utilisateur.

### Update problème 1

C'était encore une fois une connerie de ma part... Lorsque j'ai écrit le back-end, lorsque je cherchais un utilisateur, je ne voulais pas voir apparaitre un paramètre "__v" qui donne toujours "0" comme valeur. Du coup, au lieu de renvoyer le profil entier de l'utilisateur, je renvoyas un objet composé de plusieurs paramètres récupérés depuis le profil. 
SAUF QUE j'ai par la suite ajouté des choses : la photo, la biographie, etc. Du coup, ces valeurs qui étaient bien récupérées depuis la bdd, n'étaient pas transmises au front-end. Du coup, si le front end n'a pas les infos, il ne risque pas de les afficher -_- Bravo, couillon !

---------------------------------------------

## Problème 2 : Posts supprimés fantômes/persistants (résolu)
Lorsqu'un post est supprimé par l'utilisateur qui l'a créé, l'utilisateur est ensuite redirigé vers la page des messages, mais le message supprimé apparaît toujours (erreur : cannot GET post/:postId), alors qu'il devrait avoir été supprimé.

### Update problème 2

Problème résolu. Du coup, pour changer, c'est moi qui avais fait de la merde. En effet, comme un gros abruti, j'avais écrit l'implémentation de la fonction remove (qui s'occupe d'effacer un post) dans le code de OnePost comme ça :
```javascript
const response = remove(postId, token);
```

SAUF QUE voici la définition de la fonction remove :
```javascript
export const remove = async (postId, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URI}/post/${postId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return console.error(
      `Couldn't get response from api because of error: ${error}.`
    );
  }
};
```

Du coup, comme j'avais oublié d'ajouter le mot clef `await` devant le `remove(...)`, la fonction était asynchrone, et du coup la redirection avait lieu avant même que la fonction remove ait eu le temps de terminer son boulot. Cela explique pourquoi il fallait rafraîchir pour voir le post effacé : la fonction terminait son boulot tranquille en fond et le reste du site avait déjà été affiché avec des informations pas à jour.

----------------------------------------------

## Problème 3 : GET request 404 pour les photos par défaut (résolu)
Lorsque je charge les pages qui contiennent une photo, je reçois une erreur GET http://localhost:9092/user/photo/:photoId (vérifier qu'il ne s'agit pas de userId qui est envoyé dans la requête !) mais les photos sont malgré tout bien affichées...

### Update problème 3

1. Il semblerait que l'erreur n'apparaisse pas sur la page de Profile.jsx (regarder dedans pour voir ce qui est différent)
2. L'erreur n'apparaît QUE sur la page des Pirates.
3. Il semblerait également que cette erreur soit due aux photos par défaut : l'erreur n'apparaît que trois fois sur la page des Pirates : exactement le même nombre que de photos par défaut !
4. Si l'utilisateur n'a pas mis de photo, une requête GET est quand même envoyée au serveur en lui passant undefined pour le paramètre userId, ce qui cause une erreur 404.
5. Le même problème est présent sur la page d'édition d'un Post (GET http://localhost:9092/oist.photo/...)
6. Aucun souci de chargement des images dans Posts ni dans OnePost... étrange.
7. L'erreur de chargement de l'image d'un post dans EditPost a disparu ; j'avais fait un peu de zèle et ajouté un return là où il n'en fallait pas.
8. L'id de la photo est render deux fois : première fois il est à "null/undefined" et la deuxième fois (au chargement de la page) il a bien la valeur de postId. J'obtiens une erreur :
```bash
GET http://localhost:9092/post/photo/ 400 (Bad Request)

``` 
9. Je pense qu'il n'y a pas grand chose que je puisse faire pour ça, à part implémenter une condition avant l'envoi des requêtes fetch de récupération des photos des posts. Du style :

if trying fetch post/postId return true
  launch real fetch request for post/postId
else load default picture

10. La solution proposée a fonctionné : je n'ai plus aucune requête GET 404 ^^

-----------------------------------------------

## Problème 4 : pas de redirection après modif post (résolu)

Lorsque l'utilisateur a terminé de modifier son post, il clique sur le bouton Envoyer, ce qui devrait le rediriger vers la page des posts (ou sa page de profil), mais rien ne se passe ; l'utilisateur reste sur la page EditPost, mais les champs sont vidés (tous à part l'image);

### Update problème 4 :

1. Le problème pourrait-il venir de l'ordre des routes ?!
2. Problème résolu : comme un gros blaireau, j'avais oublié de mettre le mot-clef return devant :
```javascript
return <Redirect to={`${process.env.REACT_APP_API_URI}/post/${id}`}/>;
```

------------------------------------------------
 
 ## Problème 5 : modification mdp impossible depuis ResetPassword (résolu)

Lorsque l'utilisateur tente de modifier son mot de passe sur la page prévue à cet effet, sur laquelle il aura été envoyé par le lien dans l'e-mail reçu suite à sa demande de réinitialisation, on obtient une erreur :
```bash
index.js:95 PUT http://localhost:9092/reset-password/ net::ERR_CONNECTION_REFUSED
The method resetPassword inside auth/index encountered and error of type: TypeError: Failed to fetch.
Password couldn't be reset because of error: TypeError: Cannot read property 'error' of undefined.
```
Je ne vois pas du tout pourquoi j'ai cette erreur...

### Update problème 5 :

1. Le problème vient peut-être des routes utilisées ? Non, j'ai vérifié, les routes sont correctes.
2. Le front-end n'a peut-être pas les données à envoyer ? Non, j'ai vérifié, les données sont bien présentes en front-end (`newPassword` et `resetPasswordToken`).
3. J'ai peut-être fait une faute de frappe ? Non, j'ai vérifié, aucune faute de frappe.
4. Peut-être faut-il créer un nouveau champ virtuel dans le `userSchema` et modifier la clé `password` en `newPassword` dans back-end/src/controllers/auth.js ? Non, cela a retiré l'erreur obtenue, mais la modification du mot de passe ne s'est pas faite, et le req.body était toujours vide en back-end.
5. Ok, là je crois que j'ai touché le fond... Voici ce que j'avais écrit pour faire ma requête PUT au serveur :
```javascript
export const resetPassword = async (newCredentials) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URI}/reset-password/`, {
      method: "PUT",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCredentials)
    });
    return await response.json();
  } catch (error) {
    console.error(`[front-end/auth/index.js => resetPassword:101] : error: ${error}.`)
  }
};
```
L'erreur est subtile mais EXTRÊMEMENT IMPORTANTE. J'aurais dû faire plus attention en écrivant ma requête, car j'ai mal écrit cette partie :
```javascript
const response = await fetch(`${process.env.REACT_APP_API_URI}/reset-password/`, {
  method: "PUT",
  header: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
```
Plus particulièrement ici :
```javascript
header: { // j'ai oublié de mettre un "s" à "headers"...
  Accept: "application/json",
  "Content-Type": "application/json",
},
```

------------------------------------------------
 
 ## Problème 6 : GET requests nombreuses à modification des champs (résolu ?)

A chaque fois que l'utilisateur modifie un champ sur les pages de modification des infos persos, des posts, etc, le serveur envoie plein de requêtes GET (une pour chaque modification). C'est peut-être inhérent à la méthode onChange qui est appliquée sur tous les champs... Ce n'est pas un bug en soi, mais niveau performances c'est préoccupant...

### Update problème 6 :

1. Si je retire la méthode onChange, les champs deviennent read-only, ce qui va à l'encontre du but d'un formulaire, lol.

------------------------------------------------
 
 ## Problème 7 : Modification mdp impossible depuis EditProfile (résolu)

Si l'utilisateur modifie n'importe quelle information à part le mot de passe, tout se passe bien. Si il veut modifier le mot de passe en revanche, la requête fetch reste en statut "pending", pour une raison inconnue... Pas d'erreur, rien, et les données lui sont pourtant bien transmises.

### Update problème 7 :

1. L'erreur venait de la méthode .get à l'intérieur du Mongoose Schema User en back-end dans les models. En effet, j'avais comme un gros abruti écrit la méthode comme ceci :
```javascript
.get(() => {
  return this._password;
})
```
Sauf qu'en écrivant ainsi, le contexte du `this` n'était pas le bon ! C'est tout le principe des fonctions flèches... J'ai réécrit la méthode comme ceci :
```javascript
.get(function() {
  return this._password;
})
```
Et maintenant la modification du mot de passe est possible !

------------------------------------------------
 
 ## Problème 8 : Connexion websocket front-back impossible (résolu)

La connexion websocket entre le front et le back ne s'établit pas du tout.

### Update problème 8 :

1. C'est bon, j'ai trouvé la solution sur [ce site](https://masteringjs.io/tutorials/express/websockets). Il s'agissait d'une petite subtilité de l'utilisation de WebSocket avec Express que j'ignorais.

------------------------------------------------