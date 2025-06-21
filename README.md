# DisWeb 

DisWeb is a digital forensic & incident response plateform to analyse forensic artefact from disk. It use Fox-IT Dissect tools to extract forensic artefacts

# Capacity
- Display the file systeme of a disk;
- Use DISSECT to get forensic artefact;
- Run YARA rules on a disk;

# Disk supported
## OS
- Windows
- Linux
## Type of disk
- vmdk, dd, E01, vdi, ...
- acquire archive :exclamation: The file system exploration don't work

# Installation

## Requirement
- docker et docker compose
- make

## Installation
- Get the depot: $ git clone https://github.com/naurandir01/DisWeb.git .
- Create an directory that will contain the CASES.: $ mkdir <path that will contain the cases>  Exemple: /mnt/CASES
- Go in the directory DisWeb-main
- Change the variable **CASE_DIRECTORY** in .env with the path of the directory create above.
- Type *make pull* to create the image and then *make up* ou directly *make up*
- Navigate to http://<IP/FQDN>:3000

# Use CASE
## Connexion

![image](/docs/login.png)

By default the users are user@local.com et admin@local.com with credential password.

To change the password, you have to connect to the folling address http://<IP/FQDN>:5002/admin with the admin account.

Go to User et and change the password. 

## Create a CASE

1. Before create a case, go to the directory that contain the CASE and create a sub directory that will be the name of the CASE. Exemple: $ mkdir /mnt/CASES/TEST
2. Click on Case then on  **NEW CASE**. Enter the name of the directory created.

![image](/docs/case.png)

![image](/docs/add_case.png)

4. To select a CASE, click on the line. At the top right corner will be CASE: TEST

## Add a source to a CASE

In the directory that you have create for the case, create a sub directory with the name of the disk. Copy the disk in this directory

This is what the arbirescence must look like for a CASE

    /mnt/CASES
        |->TEST
            |-> PREV_1
                |-> prev_1.vmdk

Once the disk copy, go to SOURCE and click on **ADD SOURCE** and then select in the list the disk.

![image](/docs/add_source.png)

![image](/docs/add_source_2.png)

## Exécuter un plugin sur un prélèvement

One a source link to a CASE, click on the icon ![image](/docs/plugins_icone.png).

For WINDOWS, 
- REGISTRE to recontruc the registry hive.
- HAYABUSA to execute hayabusa on the evtx
- TIMELINE to a timeline. ( EVTX, USB, SHELLBAG, MFT, TASK, SAM et NAVIGATEUR). Work in progress

For Linux:
- Work in progress

## File systéme
Click File System a the left to use the file systéme of a disk

![image](/docs/file_system.png)

## Artefacts
Click on Artefact a the left to display the result from dissect plugin
![image](/docs/artefact.png)

### Registry
To see the result of plugin REGISTRY on the source, click on the REGF the ARTEFACT TAB.
![image](/docs/regf.png)

:exclamation: Il se peut que le plugin REGISTRE n'est pas finit d'indexer toutes les ruches Pour voir si la tâche est finit ou non revenir sur Prélèvements et recliquer sur l'icône des plugins ![image](/docs/plugins_icone.png). Si le plugin s'est terminé avec succès, une icône vert sera afficher.

## IOC

![image](/docs/iocs.png)

To add an IOC, click on the icon ![image](/docs/ioc_icone.png) at the top right.

![image](/docs/add_ioc.png)

## Timeline

![image](/docs/chronologie.png)

## YARA

![image](/docs/chronologie.png)

## PARAMETRES
### IOC TYPE

### YARA RULES
![image](/docs/yara_rules.png)


# Copyright and License
- Dissect is released as open source by Fox-IT (https://www.fox-it.com) part of NCC Group Plc (https://www.nccgroup.com).
