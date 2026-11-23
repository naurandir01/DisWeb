'use client'
import * as React from 'react'
import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material'

export default function FileMetadata(props: any){
    return(
        <Grid container spacing={2}>
            <Grid >
                <Card sx={{bgcolor:'#0D0B0D17'}}>
                    <CardHeader title="MACB"/>
                    <CardContent>
                        <Typography>
                            Creation Date: {props.file.btime !== undefined ? new Date(props.file.btime/1000000).toISOString():''}
                        </Typography>
                        <Typography>
                            Content Modification Date: {props.file.mtime !== undefined ?new Date(props.file.mtime/1000000).toISOString():''}
                        </Typography>
                        <Typography>
                            Last Access Date: {props.file.atime !== undefined ?new Date(props.file.atime/1000000).toISOString():''}
                        </Typography>
                        <Typography>
                            Last Metadata Change Date: {props.file.ctime !== undefined ?new Date(props.file.ctime/1000000).toISOString():''}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid >
                <Card sx={{bgcolor:'#0D0B0D17'}}>
                    <CardHeader title="HASH"/>
                    <CardContent>
                        <Typography>
                            SHA256: {props.file !== '' ? props.file.sha256:''}
                        </Typography>
                         <Typography>
                            SHA1: {props.file !== '' ? props.file.sha1:''}
                        </Typography>
                         <Typography>
                            MD5: {props.file !== '' ? props.file.md5:''}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}