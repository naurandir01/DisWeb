'use client'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import * as React from 'react';
import ArtefactDataGrid from './artefactdatagrid';
import Hayabusa from './hayabusa';
import Registry from './registry';
import SruNetwork from './srunetwork';
import Events from './event';

const plugins_not_to_show_list = [
    'mft_timeline','yara','mft','activity','os','ips','hostname','version','architecture',
    'example_yield','example_none','example_record','example','loaders','plugins','walkfs',
    'timezone','language','ntversion','domain','keys','pathenvironment','qfind',"_dpapi_keyprovider_keychain.keys",
    "_dpapi_keyprovider_lsa_defaultpassword.keys","_dpapi_keyprovider_credhist.keys","_dpapi_keyprovider_empty.keys"
]

const plugins_not_to_show_panel = [
    'mft_timeline','yara','mft','activity','os','ips','hostname','version','architecture',
    'example_yield','example_none','example_record','example','loaders','plugins','walkfs',
    'timezone','language','ntversion','domain','keys','regf','evtx','pathenvironment','sru.network_data','qfind',"_dpapi_keyprovider_lsa_defaultpassword.keys",
    "_dpapi_keyprovider_keychain.keys",,"_dpapi_keyprovider_credhist.keys","_dpapi_keyprovider_empty.keys"
]

export default function Artefact(props: any){
    const [source,setSource] = React.useState(props.source)
    const [value,setValue] = React.useState('browser.history')

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    return(
            <Box sx={{flexGrow:1,display:'flex',maxHeight:1150,flex:1,maxWidth:'100%'}}>
                <TabContext value={value} >
                    <TabList onChange={handleChange} orientation='vertical' variant="scrollable" sx={{borderRight:1, borderColor:'divider',minwidth:250}}>
                        {
                            source.source_plugins
                                .filter((artefact: any) =>!plugins_not_to_show_list.includes(artefact.name))
                                .sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                                .map((artefact: any)=>{
                                return(
                                    <Tab label={<Typography variant="caption">{artefact.name}</Typography>} value={artefact.name} key={source.source_name+'-'+artefact.name}/>
                                )
                            })
                        }
                        {
                            source.source_os == 'windows' ? <Tab label='hayabusa' value={'hayabusa'} key={source.source_name+'-hayabusa'}/>:null
                        }
                    </TabList>
                    {
                         source.source_plugins
                            .filter((artefact: any) =>!plugins_not_to_show_panel.includes(artefact.name))
                            .sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                            .map((artefact: any)=>{
                                return(
                                    <TabPanel value={artefact.name}  key={'columns-'+artefact.name} sx={{width:'95%'}}>
                                        <ArtefactDataGrid source={props.source} id={artefact.name} columns={[]} artefact={artefact}/>
                                    </TabPanel>
                                )
                            })
                    }
                    {
                        source.source_os == 'windows' ? 
                            <TabPanel value={'hayabusa'} key={'hayabusa'} >
                                <Hayabusa source={props.source}/>
                            </TabPanel>:null
                    }
                    {
                        source.source_os == 'windows' ?
                            <TabPanel value={'regf'} key={'regf'} >
                                <Registry source={props.source}/>
                            </TabPanel>:null
                    }
                     {
                        source.source_os == 'windows' ?
                            <TabPanel value={'evtx'} key={'evtx'} >
                                <Events source={props.source}/>
                            </TabPanel>:null
                    }

                    {
                        source.source_os == 'windows' ?
                            <TabPanel value={'sru.network_data'} key={'sru.network_data'} >
                                <SruNetwork source={props.source}/>
                            </TabPanel>:null
                    }
                </TabContext>
            </Box>
    )
}