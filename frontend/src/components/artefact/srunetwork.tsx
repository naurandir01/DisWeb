'use client'
import * as React from 'react';
import API from '../api/axios'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SruNetwork(props: any){
    const [source,setSource] = React.useState(props.source)
    const [rows,setRows] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const columns: GridColDef[] = React.useMemo(()=>{
            return rows !== undefined
                ? rows[0] !== undefined ? Object.keys(rows[0]).filter((key)=> key !== 'domain' && key!== 'generated' && key !== 'classification' && key !== 'version' && key !== 'source' && key !== 'id').map((key)=>({
                    field: key,
                    headerName: key,
                    flex:1
                })): []: []
        }, [rows])

    const [app,setApp] = React.useState('')
    const [listApp,setListApp] = React.useState<string[]>([])
    const [xAxsis,setXAxsis] = React.useState<Date[]>([])
    const [seriesByteSend,setSeriesByteSend] = React.useState<any[]>([])
    const [seriesByteRcevd,setSeriesByteReceived] = React.useState<any[]>([])

    function getRow(): Promise<any> {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        setLoading(true)
                        API.get('/api/sources/'+source.id_source+'/artefacts/sru.network_data').then(res=>{
                        setRows(res.data.values)
                        setLoading(false)
                    });
                }
            )
        });
    }

    React.useEffect(() => {
            let active = true;
            (
                async () => {
                    const newsrows = await getRow();
                    if (!active) {
                        return;
                    }
                }
            )()
    },[])

    React.useEffect(() => {
        const uniqueApp = [...new Set(rows.map((row:any)=>row.app))]
        setListApp(uniqueApp)

    },[rows])

    React.useEffect(() => {
        const XAxsis = rows.filter((row: any) =>row.app === app).map((row:any)=>row.ts)
        const dates = XAxsis.map((date:any)=>new Date(date))
        setXAxsis(dates)
    },[app])

    React.useEffect(() => {
        const seriebytesend = rows.filter((row: any) =>row.app === app).map((row:any)=>row.bytessent)
        setSeriesByteSend(seriebytesend)
    },[app])

    React.useEffect(() => {
        const seriebyterevcd = rows.filter((row: any) =>row.app === app).map((row:any)=>row.bytesrecvd)
        setSeriesByteReceived(seriebyterevcd)
    },[app])

    // React.useEffect(() => {
    //     console.log(seriesByteRcevd)
    //     console.log(seriesByteSend)
    // },[app])

    return(
        <Box sx={{width:2000,height:820}}>
            <DataGrid columns={columns} rows={rows}
                getRowHeight={()=>'auto'}
                showToolbar
                loading={loading}
                initialState={{
                    pagination: {paginationModel:{pageSize:25}}
                }}
                key={'artefact-data-grid-'+props.source.id_source+'-'+props.id}
            />
            <FormControl sx={{m:1,minWidth:120}}>
                <InputLabel id="app" variant='filled'>Application</InputLabel>
                <Select labelId='select-app' value={app} onChange={(event)=>setApp(event.target.value)} autoWidth>
                    {
                        listApp.map((app:any)=>{
                            return(
                                <MenuItem value={app}>{app}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
            <LineChart
                xAxis={[{data:xAxsis,scaleType:'utc'}]}
                series={[{data:seriesByteSend,label:'Byte Envoyé',color:'#4e79a7'},{data:seriesByteRcevd,label:'Byte Reçu',color:'#e15759'}]}
                height={280}
                width={2000}
                slots={{noDataOverlay:()=><Typography>Selectioner une application</Typography>}}
            />
        </Box>

    )

}