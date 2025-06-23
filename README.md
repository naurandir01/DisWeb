# DisWeb 

DisWeb is a digital forensic & incident response plateform to analyse forensic artefact from disk. It use Fox-IT Dissect tools to extract forensic artefacts

:exclamation: The project is still in progress :exclamation:

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

1. Before creating a case, go to the directory that contain the CASE and create a sub directory whose will be the name of the CASE. Exemple: $ mkdir /mnt/CASES/TEST
2. Click on Case then on  **NEW CASE**. Enter the name of the directory created.

![image](/docs/case.png)

![image](/docs/add_case.png)

4. To select a CASE, click on the line. At the top right corner will be CASE: TEST

## Add a source to a CASE

In the directory that you have created for the case, create a sub directory with the name of the disk. Copy the disk in this directory

This is what the arbirescence must look like for a CASE

    /mnt/CASES
        |->TEST
            |-> PREV_1
                |-> prev_1.vmdk

Once the disk is copy, go to SOURCE and click on **ADD SOURCE** and then select the disk in the list.

![image](/docs/add_source.png)

![image](/docs/add_source_2.png)

For encrypted disk, 

![image](/docs/add_source_crypt.png)

## Generic plugin

Once a source link to a CASE, click on the icon ![image](/docs/plugins_icone.png) to start some plugin that will ease some

For WINDOWS, 
- REGISTRE to recontruc the registry hive. Work in progress
- HAYABUSA to execute hayabusa on the evtx. Add the rule in the ./backend/external/hayabusa/rule
- TIMELINE to a timeline. ( EVTX, USB, SHELLBAG, MFT, TASK, SAM et NAVIGATEUR). Work in progress

For Linux:
- Work in progress

## File systéme
Click File System at the left to use the file system of a disk

![image](/docs/file_system.png)

## Artefacts
Click on Artefact at the left to display the result from dissect plugin
![image](/docs/artefact.png)

### Registry
To see the result of plugin REGISTRY on the source, click on the REGF the ARTEFACT TAB.
![image](/docs/regf.png)

:exclamation: To see if the task to create thge registry is finish, go back to SOURCE and click on the plugin icon ![image](/docs/plugins_icone.png).

## IOC

![image](/docs/iocs.png)

To add an IOC, click on the icon ![image](/docs/ioc_icone.png) at the top right.

![image](/docs/add_ioc.png)

## Timeline

![image](/docs/chronologie.png)

## YARA

![image](/docs/yara_run.png)

## PARAMETRES
### IOC TYPE
![image](/docs/ioc_type.png)

### YARA RULES
![image](/docs/yara_rules.png)


# Copyright and License
- Dissect is released as open source by Fox-IT (https://www.fox-it.com) part of NCC Group Plc (https://www.nccgroup.com).
