// frontend/src/components/filesystem/filestring.tsx
'use client'
import * as React from 'react'
import { Box, Card, CardContent, CardHeader, Chip, Pagination, Stack, Typography } from '@mui/material'

function TextWithLineBreaks(props: any) {
    const textWithBreaks = props.text.split('\n').map((text: string, index: number) => (
        <React.Fragment key={index}>
            {text}
            <br />
        </React.Fragment>
    ));

    return <div>{textWithBreaks}</div>;
}

export default function FileString(props: any){
    const [pagination, setPagination] = React.useState(1)

    // FIX: reset to page 1 when a NEW file is viewed — previously the
    // pagination state persisted across files, showing e.g. page 17 of a
    // fresh 3-page file (empty screen with no explanation)
    React.useEffect(() => {
        setPagination(1)
    }, [props.file])

    const handleChangePagination = (_event: any, value: number) => {
        setPagination(value)
    }

    const pageCount = Array.isArray(props.file) ? props.file.length : 0
    const currentChunk = pageCount > 0 ? (props.file[pagination - 1] ?? '') : ''

    return (
        <Card>
            <CardHeader
                action={
                    pageCount > 1 ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip size="small" label={`${pagination} / ${pageCount}`} variant="outlined"/>
                            <Pagination
                                count={pageCount}
                                page={pagination}
                                onChange={handleChangePagination}
                                size="small"
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    ) : null
                }
                title={<Typography variant="body2" color="text.secondary">
                    File content — {pageCount > 1 ? `chunk ${pagination} of ${pageCount}` : 'full view'}
                </Typography>}
            />
            <CardContent>
                <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                    {pageCount === 0
                        ? <Typography variant="body2" color="text.secondary">No readable content.</Typography>
                        // Monospace + preserved whitespace: binary strings and
                        // indentation were previously reflowed by the browser
                        : <Box component="pre" sx={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                              <TextWithLineBreaks text={currentChunk}/>
                          </Box>}
                </Box>
            </CardContent>
        </Card>
    )
}
