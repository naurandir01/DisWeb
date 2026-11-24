// frontend/src/components/source/sourcePlugins.tsx
// and frontend/src/components/source/sourceCustomPlugins.tsx share the same
// pattern — tooltip added, unused state removed.
'use client'
import * as React from 'react';
import { useDialogs } from '@toolpad/core';
import { IconButton, Tooltip } from '@mui/material';
import { Biotech, SendTimeExtension } from '@mui/icons-material';
import Plugins from './plugins';

export default function SourcePlugins(props: any){
    const dialog = useDialogs()

    return (
        <Tooltip title="Plugins — run and monitor every Dissect plugin on this source">
            <IconButton onClick={async () => {
                await dialog.open(Plugins, {src: props.source})
            }}>
                <Biotech/>
            </IconButton>
        </Tooltip>
    )
}
