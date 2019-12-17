#API ApothiCare


##Développée par Léo Riberon-Piatyszek



###Présentation de l'api

L'api a pour but d'effectuer la mise en relation des différentes informations demandées par l'utilisateur.

Celle-ci est communiquante avec la base de donnée, le site web et l'application mobile.


###Environnement

Je vous conseil d'utiliser JetBrains WebStorm, qui aura déjà une configuration similaire à la mienne (grâce au fichier .idea).

L'API tourne sur Linux, Fedora 28 en version nodeJs v11.3.

###Architecture du repository (ApothiCare/api)

Le répertoire se compose en 5 parties :
- /bin: contenant le binaire qui va être lancé pour launch l'api ;
- /models: contenant les models relatifs à la bdd, aux requêtes et à la gestion d'erreur ;
- /node_modules: contenant tout les modules nodeJs dont on aura besoin (package précisé dans package.json) ;
- /routes: contenant le code des routes et du jsonwebtoken ;
- /database: contenant le fichier de dump sql lancer par docker ;
- /test: contenant les test unitaires de chaques routes avec chaque cas possible ;
On y trouvera aussi à la racine les fichiers docker pour une intégration avec docker,
des fichiers json étant essentiel au projet et l'application (app.js) étant le coeur de l'api.


###Descriptions des routes et requêtes

Toute les requêtes sont inscrites dans le Postman avec une description expliquant les différents paramètres possibles.

Ici, nous allons juste voir l'utilité de ces routes. 


/users
- GET -> /users/:id : Retourne les infos d'un utilisateur par son id.
- GET -> /users/ : Retourne tout les utilisateurs et leurs informations.
- POST -> /users/nearestChemical : Retourne les pharmaciens les plus proches.
- POST -> /users/create : Permet de créer un compte utilisateur.
- POST -> /users/login : Permet de se connecter à un compte utilisateur.
- PUT -> /users/:id : Permet de modifier les informations d'un compte utilisateur.
- DELETE -> /users/:id : Permet de supprimer un compte utilisateur


<br>

/roles
- GET -> /roles/:id : Retourne les droits d'un role par son id.
- GET -> /roles/ : Retourne tout les roles et leurs droits.
- POST -> /roles/assignRole : Permet d'assigner un role à un utilisateur.


<br>

/medicament
- GET -> /medicament/:id : Retourne les informations d'un médicament par son id.
- GET -> /medicament?name= : Retourne les informations d'un médicament par son nom.
- GET -> /medicament?id_company= : Retourne les informations des médicaments appartenant à la companie.
- GET -> /medicament/cip/:cip_code= : Retourne les informations d'un médicament par son code CIP 13.
- GET -> /medicament/ : Retourne les informations de tout les médicaments. (déconseiller)
- GET -> /medicament/pharmacien/:cip_code : Retourne une liste de pharmacien détenant le médicament par son code CIP 13. 
- POST -> /medicament/ : Insère un nouveau médicament en base.


<br>

/company
- GET -> /company/:id : Retourne les informations d'une entreprise par son id.
- GET -> /company : Retourne les informations de toutes les entreprises.
- POST -> /company/ : Créer une nouvelle entreprise en base.


<br>

/inventory
- GET -> /inventory/:id_user : Retourne les informations d'un inventaire par son id_user.
- GET -> /inventory/deadline/:id_user : Retourne les différents médicaments hors date.
- POST -> /inventory/ : Ajoute un médicament à l'inventaire en base.
- DELETE -> /inventory/ : Supprime un médicament de l'inventaire.
