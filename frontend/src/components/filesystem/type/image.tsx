'use client'
import * as React from 'react';

export default function ImageDisplay(props:any){
    
    return (
        <img src={props.file} alt='image' />
    )

}