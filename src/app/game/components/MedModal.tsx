"use client"
import {useState, useRef, useEffect} from "react"
import '../styles/game.scss'
import 'dotenv/config'

export interface Props {
    medcount: number;
    handleSelect: (mednum: number) => void;
    isTaken: (mednum: number) => boolean;
}

export default function MedModal(props: Props) {

    function populateCabinet(medcount: number) {
        const top = ["11%", "36%", "57%"];
        const left = ["25%", "36.33%", "47.66%", "59%"];
        const imgUrls = [
            "images/bottles/vecteezy_medical-vitamin-bottle-game-pixel-art-vector-illustration_23873157.png",
            "images/bottles/vecteezy_health-vitamin-bottle-game-pixel-art-vector-illustration_23873447.png",
            "images/bottles/vecteezy_medication-vitamin-bottle-game-pixel-art-vector-illustration_23873467.png",
            "images/bottles/vecteezy_plastic-vitamin-bottle-game-pixel-art-vector-illustration_23873387.png",
            "images/bottles/vecteezy_pill-vitamin-bottle-game-pixel-art-vector-illustration_23873440.png",
            "images/bottles/vecteezy_pharmacy-vitamin-bottle-game-pixel-art-vector-illustration_23873383.png"
        ];

        var bottle_array = [];
        var rowcount = 0;
        for (var i = 0; i < medcount; i++) {
            const j = i;
            bottle_array.push(
                <>{ !props.isTaken(j) && (<img className="rm bottle" key={"child_"+ j.toString()} style={{top: top[rowcount%3], left: left[i%4]}} src={imgUrls[i%imgUrls.length]} onClick={() => props.handleSelect(j)}/>)}</>
            );
            if (i%4 == 3) rowcount++;
        }

        return bottle_array;
    }

    return(
        <div className="rm med-modal">
            <div className="med-selection-form">
                {populateCabinet(props.medcount)}
                <button className="rm door-button" style={{top: "2.5%", left: "82%"}} onClick={() => props.handleSelect(-1)}/>
                <button className="rm door-button" style={{top: "2.5%", left: "1.6%"}} onClick={() => props.handleSelect(-1)}/>
            </div>
        </div>
    );
}