// frontend/src/components/filesystem/type/image.tsx
'use client'
import { Box, Button, Stack, Typography } from '@mui/material';
import { Download, ZoomIn, ZoomOut } from '@mui/icons-material';
import * as React from 'react';

// Image evidence viewer with zoom + download.
// Blob URL managed by the parent (filedisplay.tsx) — no ownership here.
export default function ImageDisplay(props: any){
    const [zoom, setZoom] = React.useState<number>(1)

    return (
        <Box sx={{ p: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
                <Button size="small" startIcon={<ZoomOut/>} onClick={() => setZoom(z => Math.max(0.1, z - 0.25))} disabled={zoom <= 0.1}>
                    Zoom out
                </Button>
                <Button size="small" startIcon={<ZoomIn/>} onClick={() => setZoom(z => Math.min(4, z + 0.25))} disabled={zoom >= 4}>
                    Zoom in
                </Button>
                <Typography variant="caption" color="text.secondary">{Math.round(zoom * 100)}%</Typography>
                <Box sx={{ flex: 1 }}/>
                <Button size="small" startIcon={<Download/>} component="a" href={props.file} download>
                    Download
                </Button>
            </Stack>
            <Box sx={{ maxHeight: 'calc(100vh - 420px)', overflow: 'auto', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 1, p: 1 }}>
                {/* max-width 100% + zoom scale: never blows out the layout,
                    still inspectable at full resolution */}
                <img
                    src={props.file}
                    alt="evidence image preview"
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top center',
                        maxWidth: zoom === 1 ? '100%' : 'none',
                        transition: 'transform 0.15s ease',
                    }}
                />
            </Box>
        </Box>
    )
}
