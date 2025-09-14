'use client'
import * as React from 'react'
import { Card, CardContent, CardHeader, Grid,Pagination,Box } from '@mui/material'

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

    const handleChangePagination=(event: any,value: number)=>{
        setPagination(value)
    }

    return(
        <Card>
            <CardHeader
                action={
                    <Grid container>
                        {props.file.length !== 1 ? <Pagination count={props.file.length} onChange={handleChangePagination} />:null}
                    </Grid>
                }
            />
            <CardContent>
                <Box sx={{maxHeight:600,overflowY: 'scroll'}}>
                    <TextWithLineBreaks text={props.file[pagination-1] !== undefined ? props.file[pagination-1]:''}/>
                </Box>
            </CardContent>
        </Card>
    )
}