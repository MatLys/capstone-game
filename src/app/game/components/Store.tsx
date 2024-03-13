"use client"
import {useState, useRef, useEffect} from "react"
import '../styles/game.scss'
import 'dotenv/config'

export interface Props {
    handleSelect: (id: number) => void;
}

export default function Store(props: Props) {
    
    return(
        <div className="rm store_container">
            <button className="rm store-item" onClick={() => props.handleSelect(1)} >1</button>
        </div>
    )
}