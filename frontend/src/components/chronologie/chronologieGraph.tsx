// frontend/src/components/chronologie/chronologieGraph.tsx
'use client'
import * as React from 'react';
import { useSessionStorageState } from '@toolpad/core';
import API from '../api/axios'
import { BarChart } from '@mui/x-charts';
import { Alert, Box, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ArrowBack, RestartAlt } from '@mui/icons-material';

// Drill-down granularity labels, from the data Meilisearch sends back
// (ts like '2024', '2024-03', '2024-03-15', '2024-03-15T09', '2024-03-15T09:05')
function levelOf(ts: string): { label: string; level: number } {
    if (/^\d{4}$/.test(ts)) return { label: 'years', level: 0 }
    if (/^\d{4}-\d{2}$/.test(ts)) return { label: 'months', level: 1 }
    if (/^\d{4}-\d{2}-\d{2}$/.test(ts)) return { label: 'days', level: 2 }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}$/.test(ts)) return { label: 'hours', level: 3 }
    return { label: 'minutes', level: 4 }
}

function prettyTs(ts: string): string {
    return ts.replace('T', ' ').replace(':', 'h')
}

export default function ChronologieGraph(props: any){
    const [currentCas] = useSessionStorageState('cas','')
    const [dataset, setDataSet] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Drilled-down timestamp ('' = root view, i.e. grouped by years)
    const [selectedTimeStamp, setSelectedTimeStamp] = React.useState('')

    // FIX (bugs #2/#3/#4): single data-loading path. The old code had two
    // competing effects (mount + selectedTimeStamp) firing a duplicated
    // root query, an accidental '' path hitting the root endpoint, and a
    // hand-rolled history stack mutated outside setState.
    const caseId = React.useMemo(() => {
        try { return JSON.parse(currentCas || '{}').id_case ?? '' } catch { return '' }
    }, [currentCas])

    const loadData = React.useCallback(async () => {
        if (!caseId) return
        setIsLoading(true)
        setError(null)
        try {
            const res = await API.get('/cases/' + caseId + '/timeline/timestamp/' + selectedTimeStamp)
            setDataSet(res.data)
        } catch {
            setError('Failed to load the timeline statistics.')
        } finally {
            setIsLoading(false)
        }
    }, [caseId, selectedTimeStamp])

    React.useEffect(() => {
        loadData()
    }, [loadData])

    const onClick = (_event: any, params: any) => {
        const axisValue = params.axisValue?.toString()
        if (!axisValue) return
        setSelectedTimeStamp(axisValue)
        props.setTimeStampGlobal(axisValue)
    }

    // FIX (bug #4): back drops one level of the drill-down deterministically:
    // '2024-03-15T09' → '2024-03-15' → '2024-03' → '2024' → ''
    const parentOf = (ts: string): string => {
        if (!ts) return ''
        if (/T\d{2}$/.test(ts)) return ts.replace(/T\d{2}$/, '')
        return ts.replace(/-\d+$/, '')
    }

    const onBack = () => {
        const parent = parentOf(selectedTimeStamp)
        setSelectedTimeStamp(parent)
        props.setTimeStampGlobal(parent)
    }

    const onReset = () => {
        setSelectedTimeStamp('')
        props.setTimeStampGlobal('')
    }

    const { label: levelLabel, level } = levelOf(selectedTimeStamp)
    // What the bars represent at this level (children of the level)
    const childLabel = ['years', 'months', 'days', 'hours', 'minutes'][
        Math.min(level + 1, 4)]

    // FIX (bug #1): responsive width — the old hard-coded width={2200}
    // broke on smaller screens. We measure the container instead.
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [chartWidth, setChartWidth] = React.useState(800)

    React.useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width
            if (w && w > 100) setChartWidth(Math.floor(w))
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const totalEvents = React.useMemo(
        () => dataset.reduce((sum: number, d: any) => sum + (Number(d.count) || 0), 0),
        [dataset]
    )

    return (
        <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
                <Tooltip title={selectedTimeStamp ? `Back to ${level === 1 ? 'years' : 'previous level'}` : 'Root view'}>
                    <span>
                        <IconButton onClick={onBack} disabled={!selectedTimeStamp}>
                            <ArrowBack/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Reset to the root view (grouped by year)">
                    <span>
                        <IconButton onClick={onReset} disabled={!selectedTimeStamp}>
                            <RestartAlt/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography variant="subtitle2">
                    Timeline by {childLabel}
                </Typography>
                {selectedTimeStamp && (
                    <Chip size="small" color="primary" variant="outlined"
                          label={`Drill-down: ${prettyTs(selectedTimeStamp)}`}/>
                )}
                <Chip size="small" variant="outlined"
                      label={`${totalEvents.toLocaleString()} events in view`}/>
                {isLoading && <Typography variant="caption" color="text.secondary">Loading…</Typography>}
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>{error}</Alert>}

            <Box ref={containerRef} sx={{ width: '100%' }}>
                {isLoading && dataset.length === 0 ? (
                    <Stack sx={{ height: 280 }} alignItems="center" justifyContent="center">
                        <CircularProgress/>
                    </Stack>
                ) : dataset.length === 0 ? (
                    <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">
                            No timeline data — run the Timeline plugin on a source first.
                        </Typography>
                    </Box>
                ) : (
                    <BarChart
                        dataset={dataset}
                        xAxis={[{ dataKey: 'ts', scaleType: 'band',
                                  label: childLabel,
                                  tickLabelStyle: { angle: dataset.length > 24 ? 45 : 0,
                                                    textAnchor: dataset.length > 24 ? 'start' : 'middle' } }]}
                        yAxis={[{ label: 'Events' }]}
                        series={[{ dataKey: 'count', label: 'Events' }]}
                        height={280}
                        width={chartWidth}
                        margin={{ top: 24, bottom: dataset.length > 24 ? 56 : 40 }}
                        onAxisClick={onClick}
                    />
                )}
            </Box>
        </Box>
    )
}
