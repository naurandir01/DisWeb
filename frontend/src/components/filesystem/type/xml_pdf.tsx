// frontend/src/components/filesystem/type/xml_pdf.tsx
'use client'
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';
import * as React from 'react';

// PDFs render in an iframe; XML/HTML/text are fetched as text and shown
// in a scrollable monospace <pre> (an iframe would try to RENDER hostile
// HTML/JS found in evidence — display-only inspection is safer for an
// analysis tool; scripts inside an iframe would also run).
export default function XMLPDFDisplay(props: any){
    const [text, setText] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const isPdf = props.ext === 'pdf'

    React.useEffect(() => {
        if (isPdf || !props.file) return
        let active = true
        fetch(props.file)
            .then(r => r.text())
            .then(t => { if (active) setText(t) })
            .catch(() => { if (active) setError('Failed to read the document content.') })
        return () => { active = false }
    }, [props.file, isPdf])

    if (isPdf) {
        return (
            <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button
                        size="small"
                        startIcon={<Download/>}
                        component="a"
                        href={props.file}
                        download>
                        Download PDF
                    </Button>
                </Stack>
                {/* FIXED: blob: URL, not base64 — nothing to sanitize; sandbox
                    added so embedded links/JS cannot escape the viewer */}
                <iframe
                    src={props.file}
                    title="PDF content"
                    style={{ width: '100%', height: 'calc(100vh - 380px)', minHeight: 400, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }}
                    sandbox=""
                />
            </Box>
        )
    }

    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>

    if (text === null) {
        return <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Reading document…</Typography>
    }

    return (
        <Box sx={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto', p: 1 }}>
            <Box component="pre" sx={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {text}
            </Box>
        </Box>
    )
}
