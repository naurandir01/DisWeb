'use client'
import * as React from 'react';

export default function XMLPDFDisplay(props:any){

    return (
        <iframe src={props.file} title='XML content' style={{ width: '100%', height:'40pc'}} />
    )

}