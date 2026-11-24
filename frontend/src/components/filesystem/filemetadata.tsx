// frontend/src/components/filesystem/filemetadata.tsx
'use client'
import * as React from 'react'
import { Box, Card, CardContent, CardHeader, Chip, Stack, Tooltip, Typography } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'

// ns timestamps (Dissect FS entries are in nanoseconds)
function formatNs(ns: any): { iso: string; human: string } | null {
    if (ns === null || ns === undefined || ns === '') return null
    const d = new Date(Number(ns) / 1000000)
    if (isNaN(d.getTime())) return null
    return { iso: d.toISOString(), human: d.toLocaleString() }
}

// Copy-to-clipboard for hashes (analysts paste them in VirusTotal etc.)
function CopyableHash({ label, value }: { label: string; value?: string | null }) {
    const [copied, setCopied] = React.useState(false)
    if (!value) {
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 70 }}>{label}:</Typography>
                <Typography variant="body2" color="text.secondary">—</Typography>
            </Stack>
        )
    }
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 32 }}>
            <Typography variant="body2" sx={{ minWidth: 70 }}>{label}:</Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                <Chip
                    size="small"
                    label={<span style={{ fontFamily: 'monospace' }}>{value}</span>}
                    onClick={() => {
                        navigator.clipboard.writeText(value)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 1500)
                    }}
                    icon={<ContentCopy fontSize="small"/>}
                    variant="outlined"
                    sx={{ maxWidth: '100%', height: 24 }}
                />
            </Tooltip>
        </Stack>
    )
}

function DateField({ label, ns }: { label: string; ns: any }) {
    const fmt = formatNs(ns)
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 210 }}>{label}:</Typography>
            {fmt
                ? <Tooltip title={`ISO 8601: ${fmt.iso}`}>
                      <Typography variant="body2">{fmt.human}</Typography>
                  </Tooltip>
                : <Typography variant="body2" color="text.secondary">—</Typography>}
        </Stack>
    )
}

export default function FileMetadata(props: any){
    const file = props.file ?? {}
    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ pt: 1 }}>
            <Card sx={{ bgcolor: '#0D0B0D17', flex: 1 }}>
                <CardHeader title="MACB timestamps"
                    subheader={<Typography variant="caption" color="text.secondary">
                        Human-readable (hover for ISO 8601 — was raw ISO before)</Typography>}/>
                <CardContent sx={{ pt: 0 }}>
                    <Stack spacing={0.5}>
                        <DateField label="Creation (B)" ns={file.btime}/>
                        <DateField label="Content Modification (M)" ns={file.mtime}/>
                        <DateField label="Last Access (A)" ns={file.atime}/>
                        <DateField label="Last Metadata Change (C)" ns={file.ctime}/>
                    </Stack>
                </CardContent>
            </Card>
            <Card sx={{ bgcolor: '#0D0B0D17', flex: 1 }}>
                <CardHeader title="Hashes"
                    subheader={<Typography variant="caption" color="text.secondary">
                        Click a hash to copy it (clickable chips now wrap instead of overflowing)</Typography>}/>
                <CardContent sx={{ pt: 0 }}>
                    <Stack spacing={0.5}>
                        <CopyableHash label="SHA-256" value={file.sha256}/>
                        <CopyableHash label="SHA-1" value={file.sha1}/>
                        <CopyableHash label="MD5" value={file.md5}/>
                    </Stack>
                </CardContent>
            </Card>
            <Card sx={{ bgcolor: '#0D0B0D17', flex: 1 }}>
                <CardHeader title="File properties"/>
                <CardContent sx={{ pt: 0 }}>
                    <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 70 }}>Path:</Typography>
                            <Tooltip title={file.path}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>{file.path ?? '—'}</Typography>
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 70 }}>Type:</Typography>
                            <Typography variant="body2" fontFamily="monospace">{file.type ?? '—'}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 70 }}>Magic:</Typography>
                            <Tooltip title={file.subtype}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>{file.subtype ?? '—'}</Typography>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}
