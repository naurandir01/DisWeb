// frontend/src/components/filesystem/type/sql.tsx
'use client'
import { Alert, Box, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import initSqlJs from 'sql.js';
import API from '../../api/axios';

// SQLite/DB3 evidence viewer (sql.js runs entirely client-side).
//
// BUG FIXED (major): the original created an EMPTY database
// (`new SQL.Database()`) and never loaded the evidence file into it —
// the table selector was therefore always populated with the schema of
// an empty in-memory DB, and table data could never come from evidence.
// The file is now downloaded as an ArrayBuffer and passed to
// `new SQL.Database(buffer)`.

export default function SQLiteDIsplay(props: any){
    const [db, setDb] = React.useState<initSqlJs.Database | null>(null);
    const [tables, setTables] = React.useState<string[]>([])
    const [selectedTable, setSelectedTable] = React.useState('')
    const [tableRows, setTableRows] = React.useState<any[]>([])
    const [tableColumns, setTableColumns] = React.useState<GridColDef[]>([])
    const [rowCount, setRowCount] = React.useState<number>(0)
    const [error, setError] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const loadDatabase = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const SQL = await initSqlJs({ locateFile: url => url })

            // FIX: actually LOAD the evidence file into the database
            const res = await API.get(
                '/sources/' + props.id_source + '/fs/get_file?file_path=' + encodeURIComponent(props.file.path),
                { responseType: 'arraybuffer' }
            )
            const buffer = new Uint8Array(res.data)
            const database = new SQL.Database(buffer)

            const tablesRes = database.exec("SELECT name FROM sqlite_master WHERE type='table';")
            const names = tablesRes.length > 0
                ? (tablesRes[0].values.map((v: any) => String(v[0])))
                : []
            setTables(names)
            setDb(database)
            setError(null)
        } catch (e: any) {
            console.error('Failed to load sqlite file', e)
            setError('Failed to load the database file — it may be corrupted or not a SQLite file.')
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        loadDatabase()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.file?.path])

    const fetchTableData = (tableName: string) => {
        if (!db || !tableName) return
        try {
            const data = db.exec(`SELECT * FROM "${tableName}";`)
            if (data.length === 0) {
                setTableColumns([])
                setTableRows([])
                setRowCount(0)
                return
            }
            const cols: GridColDef[] = data[0].columns.map((col: string) => ({
                field: col,
                headerName: col,
                width: 150,
                flex: 1,
            }))
            // FIX: rows were built as {...row} where row is an ARRAY —
            // DataGrid got rows with no proper fields. Rows are now
            // correctly mapped column-name → cell value.
            const rows = data[0].values.map((row: any[], index: number) => {
                const obj: Record<string, any> = { id: index }
                data[0].columns.forEach((col: string, i: number) => {
                    obj[col] = row[i] === null ? 'NULL' : String(row[i]);
                })
                return obj
            })
            setTableColumns(cols)
            setTableRows(rows)
            setRowCount(rows.length)
        } catch (e) {
            console.error('Failed to query table', e)
            setError(`Failed to read table "${tableName}".`)
        }
    }

    const handleTableChange = (event: any) => {
        const tableName = event.target.value;
        setSelectedTable(tableName)
        setError(null)
        fetchTableData(tableName)
    }

    return (
        <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <TextField
                    select
                    label="Table"
                    size="small"
                    value={selectedTable}
                    onChange={handleTableChange}
                    sx={{ minWidth: 250 }}
                    disabled={isLoading || tables.length === 0}
                >
                    <MenuItem value="" disabled>Select a table</MenuItem>
                    {
                        tables.map((table: string) => (
                            <MenuItem key={table} value={table}>{table}</MenuItem>
                        ))
                    }
                </TextField>
                {selectedTable && (
                    <Typography variant="caption" color="text.secondary">
                        {rowCount.toLocaleString()} rows
                    </Typography>
                )}
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

            {isLoading && (
                <Stack sx={{ py: 8 }} alignItems="center">
                    <CircularProgress size={28}/>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Loading SQLite database from evidence…
                    </Typography>
                </Stack>
            )}

            {!isLoading && !error && tables.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No tables found in this database.
                </Typography>
            )}

            {!isLoading && tableRows.length > 0 && (
                <Box sx={{ height: 550 }}>
                    <DataGrid
                        rows={tableRows}
                        columns={tableColumns}
                        getRowHeight={() => 'auto'}
                        initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
                        localeText={{ noRowsLabel: 'This table is empty' }}
                    />
                </Box>
            )}

            {!isLoading && selectedTable && tableRows.length === 0 && !error && tables.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    Table « {selectedTable} » is empty.
                </Typography>
            )}
        </Box>
    )
}
