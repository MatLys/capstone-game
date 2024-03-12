"use client"
import {useState, useRef, useEffect} from "react"
import '../styles/game.scss'
import 'dotenv/config'
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { Button } from "react-bootstrap"

export interface Props {
    medication: {
        schedule_id: number,
        medication: string,
        dose: string,
        date: Date,
        is_taken: boolean
    };
    handleSubmit: () => void;
}

export default function Questionnaire(props: Props) {

    const date = new Date();

    const mounted = useRef(false);

    const medinfo = useRef("");

    useEffect(() => {
        fetch("http://127.0.0.1:1492/medicines/byname/" + props.medication.medication, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            medinfo.current = data.description;
        })
    }, [props.medication])

    function dateString() {
        const str1 = date.toLocaleDateString('en-us', {
            year:"numeric",
            month:"short",
            day:"numeric",
            hourCycle: "h12",
            hour: "numeric",
            minute: "numeric"
        }).replaceAll(',', '');

        return str1;
    }

    function medTitle() {
        var title = "";
        if (props.medication) title = props.medication.medication + " (" + props.medication.dose + "): " + dateString();
        return title;
    }

    function CustomToggle({ children, eventKey }: any) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>{});
      
        return (
          <button type="button" className="accordion-header" onClick={decoratedOnClick}>
            {children}
          </button>
        );
      }

    return(
        <>
                <h1>{medTitle()}</h1>
                <Accordion defaultActiveKey="0">
                    <Card.Header>
                        <CustomToggle eventKey="0">Information</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className="accordion-body">
                            <div className="accordion-flex-parent">
                               {medinfo.current}
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Accordion>

                <div style={{height: "10px"}}/>

                <Button style={{marginLeft: "90%", backgroundColor: "green"}} onClick={props.handleSubmit}>Submit</Button>
            </>
    );
}