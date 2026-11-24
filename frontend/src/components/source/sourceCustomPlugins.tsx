// frontend/src/components/source/sourceCustomPlugins.tsx
'use client'
import * as React from 'react';
import { useDialogs } from '@toolpad/core';
import { IconButton, Tooltip } from '@mui/material';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import CustomPlugins from './customPlugins';

export default function SourcePlugins(props: any){
    const dialog = useDialogs()

    return (
        <Tooltip title="Custom plugins — Hayabusa, Registry, Timeline">
            <IconButton onClick={async () => {
                await dialog.open(CustomPlugins, {src: props.source})
            }}>
                <SendTimeExtensionIcon/>
            </IconButton>
        </Tooltip>
    )
}
