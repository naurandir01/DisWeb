// frontend/src/components/case/meilisettings.tsx
'use client'
import * as React from 'react';
import {
    Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, Grid, Stack, Tooltip, Typography,
} from '@mui/material';
import { Refresh, Search, Storage, Tune, FilterAlt, Sort } from '@mui/icons-material';
import { caseAPI } from '../api/api';

// Section wrapper: titled block with an icon
function Section({icon, title, children}: {icon: React.ReactNode, title: string, children: React.ReactNode}) {
    return (
        <Stack sx={{mb: 2}} spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{color: 'primary.main'}}>{icon}</Box>
                <Typography variant="subtitle2">{title}</Typography>
            </Stack>
            {children}
        </Stack>
    )
}

// Chip list renderer for attribute arrays ("*", ["source","plugin"], ...)
function AttrChips({attrs, color}: {attrs: any, color?: any}) {
    const list = attrs ?? []
    if (!Array.isArray(list) || list.length === 0) {
        return <Typography variant="caption" color="text.secondary">(none configured)</Typography>
    }
    return (
        <Stack direction="row" sx={{flexWrap: 'wrap', gap: 0.5}}>
            {list.map((a: any, i: number) => {
                const label = typeof a === 'string'
                    ? a
                    // attributePatterns objects (facetSearch/filters config)
                    : (a.attributePatterns ?? []).join(', ') + '  (facetSearch)'
                return (
                    <Chip key={i} size="small" variant="outlined" color={color ?? 'default'}
                          label={<span style={{fontFamily: 'monospace'}}>{label}</span>}
                          sx={{height: 22}}/>
                )
            })}
        </Stack>
    )
}

function KV({label, value}: {label: string, value: React.ReactNode}) {
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{minHeight: 28}}>
            <Typography variant="caption" color="text.secondary" sx={{minWidth: 150}}>{label}</Typography>
            <Typography variant="body2">{value}</Typography>
        </Stack>
    )
}

export default function MeiliSettingsDialog({payload, open, onClose}: {payload: any, open: boolean, onClose: () => void}){
    const [data, setData] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const load = React.useCallback(async () => {
        if (!payload?.id) return
        setIsLoading(true); setError(null)
        try {
            const res = await caseAPI.getCaseMeilliSettings(payload.id)
            setData(res.data)
        } catch {
            setError('Failed to load Meilisearch index information.')
        } finally {
            setIsLoading(false)
        }
    }, [payload?.id])

    React.useEffect(() => {
        if (open) load()
    }, [open, load])

    const stats = data?.stats ?? {}
    const settings = data?.settings ?? {}

    const numberOfDocuments: number = stats.numberOfDocuments ?? 0

    return (
        <Dialog fullWidth open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Storage/>
                    <Typography variant="h6">Search index — {data?.index_uid ?? '…'}</Typography>
                    {stats.isIndexing
                        && <Chip size="small" color="warning" icon={<CircularProgress size={12} color="inherit"/>}
                                 label="Indexing…"/>}
                    <Box sx={{flex: 1}}/>
                    <Tooltip title="Reload index statistics">
                        <Button size="small" startIcon={<Refresh/>} onClick={load} disabled={isLoading}>
                            Refresh
                        </Button>
                    </Tooltip>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                {isLoading && !data
                    ? <Stack sx={{py: 8}} alignItems="center"><CircularProgress/></Stack>
                    : data && (
                    <Box>
                        {/* ---- Health / usage ---- */}
                        <Section icon={<Storage fontSize="small"/>} title="Index health & usage">
                            <Grid container spacing={1}>
                                <Grid size={4}>
                                    <Stack sx={{p: 1.5, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1}} alignItems="center">
                                        <Typography variant="h5">{numberOfDocuments.toLocaleString()}</Typography>
                                        <Typography variant="caption" color="text.secondary">indexed artefacts</Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={4}>
                                    <Stack sx={{p: 1.5, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1}} alignItems="center">
                                        <Typography variant="h5" color={stats.isIndexing ? 'warning.main' : 'success.main'}>
                                            {stats.isIndexing ? 'BUSY' : 'READY'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">index status</Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={4}>
                                    <Stack sx={{p: 1.5, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1}} alignItems="center">
                                        <Typography variant="body2" noWrap>
                                            {stats.lastUpdate && stats.lastUpdate !== 'None'
                                                ? new Date(stats.lastUpdate).toLocaleString()
                                                : '—'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">last update</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Section>

                        <Divider sx={{mb: 2}}/>

                        {/* ---- Searchable attributes ---- */}
                        <Section icon={<Search fontSize="small"/>} title="Searchable attributes">
                            <Typography variant="caption" color="text.secondary" sx={{display: 'block', mb: 0.5}}>
                                Fields matched by full-text queries, by decreasing priority.
                            </Typography>
                            <AttrChips attrs={settings.searchableAttributes} color="primary"/>
                        </Section>

                        {/* ---- Filterable attributes ---- */}
                        <Section icon={<FilterAlt fontSize="small"/>} title="Filterable attributes">
                            <Typography variant="caption" color="text.secondary" sx={{display: 'block', mb: 0.5}}>
                                Usable in grid filters and facets (source separation, plugin name…).
                            </Typography>
                            <AttrChips attrs={settings.filterableAttributes} color="secondary"/>
                        </Section>

                        {/* ---- Sortable attributes ---- */}
                        <Section icon={<Sort fontSize="small"/>} title="Sortable attributes">
                            <Typography variant="caption" color="text.secondary" sx={{display: 'block', mb: 0.5}}>
                                Columns supporting server-side sorting in the artefacts grids.
                            </Typography>
                            <AttrChips attrs={settings.sortableAttributes} color="success"/>
                        </Section>

                        <Divider sx={{mb: 2}}/>

                        {/* ---- Other settings (collapsed to a compact table) ---- */}
                        <Section icon={<Tune fontSize="small"/>} title="Other relevance settings">
                            <Stack spacing={0.25}>
                                <KV label="Displayed attributes"
                                    value={<AttrChips attrs={settings.displayedAttributes}/>}/>
                                <KV label="Ranking rules"
                                    value={<Typography variant="caption" fontFamily="monospace">
                                        {(settings.rankingRules ?? []).join(' → ')}
                                    </Typography>}/>
                                <KV label="Stop words"
                                    value={(settings.stopWords ?? []).length > 0
                                        ? <AttrChips attrs={settings.stopWords}/>
                                        : <Typography variant="caption" color="text.secondary">(none)</Typography>}/>
                                <KV label="Synonyms"
                                    value={Object.keys(settings.synonyms ?? {}).length > 0
                                        ? <Typography variant="caption" fontFamily="monospace">
                                            {Object.keys(settings.synonyms).length} synonym groups
                                          </Typography>
                                        : <Typography variant="caption" color="text.secondary">(none)</Typography>}/>
                                <KV label="Typo tolerance"
                                    value={<Chip size="small" variant="outlined"
                                                 label={settings.typoTolerance?.enabled !== false ? 'Enabled' : 'Disabled'}/>}/>
                                <KV label="Distinct on"
                                    value={<Typography variant="caption" fontFamily="monospace">
                                        {settings.distinctAttribute ?? '(none)'}
                                    </Typography>}/>
                                <KV label="Pagination max total"
                                    value={<Typography variant="caption">
                                        {settings.pagination?.maxTotalHits?.toLocaleString() ?? '—'}
                                    </Typography>}/>
                            </Stack>
                        </Section>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
