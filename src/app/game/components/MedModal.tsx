"use client"
import {useState, useRef, useEffect} from "react"
import '../styles/game.scss'
import 'dotenv/config'

export interface Props {
    handleSubmit: () => void;
}

export default function MedModal(props: Props) {

    return(
        <div className="rm med-modal">
            <div className="med-selection-form">
                {/* <button onClick={props.handleSubmit}>SUBMIT</button> */}
                <img className="rm bottle-shelf1" style={{left: "25%"}} src="images\bottles\vecteezy_medical-vitamin-bottle-game-pixel-art-vector-illustration_23873157.png"/>
                <img className="rm bottle-shelf1" style={{left: "36.33%"}} src="images\bottles\vecteezy_health-vitamin-bottle-game-pixel-art-vector-illustration_23873447.png"/>
                <img className="rm bottle-shelf1" style={{left: "36.33%", opacity: 0.5}} src="images\bottles\bottle_blue_outline_green.png"/>
                <img className="rm bottle-shelf1" style={{left: "47.66%"}} src="images\bottles\vecteezy_medication-vitamin-bottle-game-pixel-art-vector-illustration_23873467.png"/>
                <img className="rm bottle-shelf1" style={{left: "59%"}} src="images\bottles\vecteezy_plastic-vitamin-bottle-game-pixel-art-vector-illustration_23873387.png"/>
                <img className="rm bottle-shelf2" style={{left: "25%"}} src="images\bottles\vecteezy_pill-vitamin-bottle-game-pixel-art-vector-illustration_23873440.png"/>
                <img className="rm bottle-shelf2" style={{left: "36.33%"}} src="images\bottles\vecteezy_pharmacy-vitamin-bottle-game-pixel-art-vector-illustration_23873383.png"/>
            </div>
        </div>
    );
}