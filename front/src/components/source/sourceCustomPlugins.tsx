"use client"
import * as React from 'react';
import { useDialogs, useNotifications } from '@toolpad/core';
import { IconButton } from '@mui/material';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import CustomPlugins from './customPlugins';

export default function SourcePlugins(props: any){
    const [source,setSource] = React.useState(props.source)
    const [openDialog,setOpenDialog] = React.useState(false)
    const notification = useNotifications()
    const dialog = useDialogs()
  
    return(
      <div>
        <IconButton onClick={async ()=>{
          await dialog.open(CustomPlugins,{src:source})
        }}>
          <SendTimeExtensionIcon/>
        </IconButton>
      </div>
    )
  }