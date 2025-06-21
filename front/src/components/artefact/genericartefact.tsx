'use client'
import * as React from 'react';

const listGenericArtefact = [
    {
        id:'browser.history',name:'Navigateur Historique',columns:[
            {field:'ts',headerName:'Date',flex:1},
            {field:'browser',headerName:'Navigaeur',flex:1},
            {field:'url',headerName:'URL',flex:1},
            {field:'username',headerName:'Utilisateur',flex:1},
            {field:'userid',headerName:'ID',flex:1},
        ]
    },
    {
        id:'browser.extensions',name:'Navigateur Extensions',columns:[
            {field:'tsinstall',headerName:'Installation',flex:1},
            {field:'tsupdate',headerName:'Mise à jour',flex:1},
            {field:'browser',headerName:'Navigaeur',flex:1},
            {field:'name',headerName:'Nom',flex:1},
            {field:'description',headerName:'Description',flex:1},
            {field:'extpath',headerName:'Chemin',flex:1},
            {field:'username',headerName:'Utilisateur',flex:1},
            {field:'userid',headerName:'ID',flex:1},
        ]
    }
]

export default listGenericArtefact