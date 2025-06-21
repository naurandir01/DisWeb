# PAFDD 

PAFDD est une plateforme d'analyse forensique de disque dur. En utilisant le Framework python DISSECT, il vous permet d'analyser via une interface web le contenue d'un disque dur.

# Capacités
- Permet de parcourir le système de fichier d'une copie de disque
- Utilise DISSECT pour récupérer une liste d'artefact

# Types de prélèvement supportés
## OS
- Windows
- Linux
## Types de fichiers
- vmdk, dd, E01, vdi,
- archive créer avec l'outil acquire de Dissect :exclamation: L'exploration du système de fichier ne retourne rien

# Installation

## Prérequis
- docker et docker compose
- make

## Installation
- Copier le dépôt: $ git clone https://github.com/naurandir01/Orome.git ou télécharger le contenue du dépôt sur GITHUB.
- Créer un dossier sur la machine où sera installé PAFDD. Ce dossier contiendra les CASES : $ mkdir <chemin contenant les cases>  Exemple: /mnt/CASES
- Aller dans le dossier Orome-main
- Modifier la variable **CASE_DIRECTORY** dans le fichier .env avec le chemin du dossier précédemment crée.
- taper la commande *make pull* pour créer les images et ensuite *make up* ou directement *make up*
- Aller sur l'adresse IP de la machine dans une navigateur : http://<IP/FQDN>:3000

# Utilisation

:exclamation: Il y a un défaut sur la résolution dans le navigateur ( il sera résolu dans une prochaine version). Pour afficher correctement les pages, il faut dézoomer le navigateur. De préférence à 70% :exclamation:

## Connexion

![image](/docs/connexion.png)

Les utilisateurs par défaut sont user@local.com et admin@local.com avec comme mot de passe password.

Pour l'instant il n'est pas possible de modifier les utilisateurs depuis l'interface web principale.

Pour les modifier, se connecter à l'adresse suivante http://<IP/FQDN>:5002/admin avec le compte admin.

Aller dans User et modifier les mot de passes des utilisateurs. 

## Créer un CAS

1. Avant de créer un cas, aller dans le dossier contenant les cas et créer un dossier avec le nom du cas que vous voulez créer. Exemple: $ mkdir /mnt/CASES/TEST
2. Cliquer sur Case dans la barre à gauche et ensuite sur **NOUVEAU CAS**. Rentrer le nom du dossier que vous avez créés.

![image](/docs/cases.png)

![image](/docs/case_creation.png)

4. Ensuite pour sélectionner un CAS cliquer sur le ligne du cas que vous voulez sélectionner. En haut à droite vous devez voir apparaitre CAS: TEST

## Ajouter un prélèvement à un CAS

Dans le dossier que vous avez créé pour le cas, créer un autre sous-dossier avec le nom du disque dur. Copier dans ce dossier le disque dur.

Voici l'arborescence que doit avoir un CAS:

    /mnt/CASES
        |->TEST
            |-> PREV_1
                |-> prev_1.vmdk

Une fois le prélèvement copié, aller dans sur l'interface web et cliquer sur Prélèvements à gauche.
Ensuite sur **AJOUTER UN PRELEVEMENT** et ensuite sur la liste déroulante et sélectionner le disque.

![image](/docs/prelevements.png)

## Exécuter un plugin sur un prélèvement
Une fois un prélèvement lié à un CAS, cliquer sur l'icône ![image](/docs/plugins_icone.png).

Pour WINDOWS, 
- REGISTRE permet de reconstruire les bases de registres pour permettre de les parcourir.
- HAYABUSE permet d'exécuter l'outil hayabusa sur les journaux d'événements. ( NON FONCTIONNEL, une erreur sur l'extraction des EVTX)
- CHRONOLOGIE permet de créer un chronologie des évènements. ( EVTX, USB, SHELLBAG, MFT, TACHES, SAM et NAVIGATEUR)

Pour Linux:
- En cours

## Système de fichier
Cliquer sur File System à gauche pour parcourir le system de fichier des prélèvements

![image](/docs/filesystem.png)

## Artefacts
Cliquer sur Artefact à gauche pour voir les résultats des différents plugins de dissect.

![image](/docs/artefact.png)

### Registre
Pour voir le résultat du plugin REGISTRE sur le prélèvement, aller dans l'onglet REGF des artefacts:
![image](/docs/regf.png)

:exclamation: Il se peut que le plugin REGISTRE n'est pas finit d'indexer toutes les ruches Pour voir si la tâche est finit ou non revenir sur Prélèvements et recliquer sur l'icône des plugins ![image](/docs/plugins_icone.png). Si le plugin s'est terminé avec succès, une icône vert sera afficher.

## IOC

![image](/docs/ioc.png)

Pour ajouter un IOC cliquer sur l'icône  ![image](/docs/ioc_icone.png) en haut à droite de la page.

![image](/docs/add_ioc.png)

## Chronologie

![image](/docs/chronologie.png)

# Copyright and License
- Dissect est la propriété de FOX-IT (https://www.fox-it.com/) membre de NCC Group Plc (https://www.nccgroup.com/). 
