'use client'
import { Box, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import initSqlJs from 'sql.js';
import API from '../../api/axios';

export default function SQLiteDIsplay(props:any){
    const [db, setDb] = React.useState<initSqlJs.Database|null>(null);
    const [tables,setTables] = React.useState<any>([])
    const [seletedTable,setSelectedTable] =React.useState('')
    const [tableData,setTableData] = React.useState([{}])
    const [tableColumns,setTableColumns] = React.useState<any>([])

    const loadeDatabase = async (file: any)=>{
        try{
            const SQL = await initSqlJs({
                locateFile:url => url
            })
            const database = new SQL.Database();
            const tables = database.exec("SELECT name FROM sqlite_master WHERE type='table';");
            console.log(tables)
            setTables(tables[0].values[0]);
            setDb(database); 
        }catch (error){
            console.log('Erreur dans le chargement du fichier',error)
        }
    }

    const fetchTableData =(tableName: string)=>{
        if(db && tableName){
            const data = db.exec(`SELECT * FROM ${tableName};`);
            setTableData(data[0].values);
            setTableColumns(data[0].columns.map((col: any, index: any) => ({
                field: col,
                headerName: col,
                width: 150,
                flex: 1,
            })));
        }
    }

    React.useEffect(()=>{
        loadeDatabase(props.file)
    },[])
   

    const handleTableCHange = (event: any)=>{
        const tableName = event.target.value;
        setSelectedTable(tableName)
        fetchTableData(tableName)
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Select value={seletedTable} onChange={handleTableCHange} displayEmpty  sx={{ marginBottom: 2 }} >
                <MenuItem value="" disabled>Selectionner une table</MenuItem>
                {
                    tables.map((table: any, index: any) => (
                        <MenuItem key={index} value={table}>{table}</MenuItem>
                    ))
                }
            </Select>

            {
                tableData.length > 0 && (
                    <div>
                        <DataGrid
                            rows={tableData.map((row:any , index) => ({ id: index, ...row }))}
                            columns={tableColumns}
                        />
                    </div>
                )
            }

        </Box>
    )

}