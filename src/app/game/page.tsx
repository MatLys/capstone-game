"use client"
import {useState, useRef, useEffect} from "react"
import Bar from "./components/Bar"
import './styles/game.scss'
import 'dotenv/config'
import MedModal from "./components/MedModal"
import Dropdown from 'react-bootstrap/Dropdown';
import Carousel from 'react-bootstrap/Carousel';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { Button } from "react-bootstrap"

export default function Game() {
    const [date, setDate] = useState(new Date());

    const [points, setPoints] = useState(0);
    const [hunger, setHunger] = useState(0);
    const [happiness, setHappiness] = useState(100);
    const [health, setHealth] = useState(100);

    const childNumber = useRef("+16478184659");
    const parentNumber = useRef("+16478184659");
    const alertThreshold = useRef(30); //minutes


    //Object array: {medication, time, is_taken, is_missed}
    const medlist = useRef(new Array());


    //Misc page control variables
    const medSelection = useRef(false);
    
    //Get game data
    useEffect(() => {
        //Fetch game data on first render.
        //...
        medlist.current.push({medication: "tylenol", time: "08:00", is_taken: false, is_missed: false});
        medlist.current.push({medication: "advil", time: "12:00", is_taken: false, is_missed: false});
        medlist.current.push({medication: "aspirin", time: "18:00", is_taken: false, is_missed: false});
    }, []);

    //Clock
    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate(new Date())
        }, 1000)
    
        return () => clearInterval(intervalId);
    });

    //Medication check
    useEffect(() => {
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        if (date.toTimeString() === midnight.toTimeString()) {
            medlist.current.forEach((medication) => medication.taken = false);
            setHealth((health + 25 > 100)? 100: health + 25)
        }

        medlist.current.forEach((medication) => {
            var medDate = new Date();
            medDate.setHours(
                parseInt(medication.time.split(":")[0]),
                parseInt(medication.time.split(":")[1]),
                0);
            if(date.valueOf() - medDate.valueOf() == alertThreshold.current * -60000) {
                alertMedication(medication.med);
            }
            if(date.valueOf() - medDate.valueOf() == alertThreshold.current * 60000 && !medication.is_taken) {
                missedMedication(medication.med);
            }
        });
    }, [date]);

    function sendSMS(number:string, message:string) {
        fetch("/api/messaging", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: number,
                message: message
            })})
        .then(response => {response.json()
        .then(data => {console.log(date.toISOString() + 'SMS SENT: ' + data.body)})})
    }

    function alertMedication(med: string) {
        const message = "ECE498B Pending medication alert: to child"
        sendSMS(childNumber.current, message);
    }

    function tookMedication(med: string) {
        setTaken(med, true);
        setHunger((hunger - 25 < 0)? 0: hunger - 25);
        if (hunger <= 0) setPoints(points + 10);
    }
    
    function missedMedication(med: string) {
        const message_parent = "ECE498B Missed medication alert: to parent."
        sendSMS(parentNumber.current, message_parent);

        const message_child = "ECE498B Missed Medication alert: to child."
        sendSMS(childNumber.current, message_child);

        setMissed(med, true);
        setHunger((hunger + 25 > 100)? 100: hunger + 25);
        if (hunger >= 100) setHealth((health - 25 < 0)? 0: health - 25);
    }

    function setTaken(med: string, taken: boolean) {
        for(var i = 0; i < medlist.current.length; i++) {
            if (medlist.current[i].med === med) {
                medlist.current[i].taken = taken;
                break;
            }
        }
    }

    function setMissed(med: string, missed: boolean) {
        for(var i = 0; i < medlist.current.length; i++) {
            if (medlist.current[i].med === med) {
                medlist.current[i].missed = missed;
                break;
            }
        }
    }

    function resetGame() {
        setPoints(0);
        setHunger(0);
        setHappiness(100);
        setHealth(100);
    }

    function handleMedSubmit() {
        medSelection.current = false;
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
        <div className="game--container">

            <link href="https://fonts.cdnfonts.com/css/comic-helvetic" rel="stylesheet"/>

            <div className="main-param-bar">
                <h4 className="points--container">{points}</h4>
                <Bar title="Hunger" percent={hunger}/>
                <Bar title="Happiness" percent={happiness}/>
                <Bar title="Health" percent={health}/>
            </div>

            {/* <div style={{display:"flex"}}>
                <button className="button" onClick={() => tookMedication("")}>Take pill</button>
                <button className="button" onClick={() => missedMedication("")}>Forget pill</button>
            </div> */}
            <div className="med-info--container">
                <h1>May 26 2022 8:33AM</h1>
                <h1>Good Morning!</h1>
                {/* <h1>Dexedrine (5mg, Pill): May 26 2022 8:33AM</h1>
                <Accordion defaultActiveKey="0">
                    <Card.Header>
                        <CustomToggle eventKey="0">General</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className="accordion-body">
                            
                            <div className="accordion-flex-parent">
                                How did you take your medicine?
                                <div className="accordion-flex-child">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Orally
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Orally</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Suborally</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Instilled</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </div>
                            </div>
                            
                            <div style={{height: "10px"}}/>

                            <div className="accordion-flex-parent">
                                How many pills did you take?
                                <div className="accordion-flex-child">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            1
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">1</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">2</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">3</Dropdown.Item>
                                            <Dropdown.Item>4</Dropdown.Item>
                                            <Dropdown.Item>5</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>

                    <Card.Header>
                        <CustomToggle eventKey="1">Procedure</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body className="accordion-body">
                            
                            <div className="accordion-flex-parent">
                                How did you take your medicine?
                                <div className="accordion-flex-child">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Orally
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Orally</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Suborally</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Instilled</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </div>
                            </div>
                            
                            <div style={{height: "10px"}}/>

                            <div className="accordion-flex-parent">
                                How many pills did you take?
                                <div className="accordion-flex-child">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            1
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">1</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">2</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">3</Dropdown.Item>
                                            <Dropdown.Item>4</Dropdown.Item>
                                            <Dropdown.Item>5</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Accordion>

                <div style={{height: "10px"}}/>

                <Button style={{marginLeft: "90%", backgroundColor: "green"}}>Submit</Button> */}
            </div>

            <div className="room--container">
                <img className="rm cabinet" src="images/cabinet/cabinet_closed_tint.png"/>
                <button className="rm cabinet-button" onClick={() => {medSelection.current = true}}/>
                {medSelection.current && (
                    <MedModal handleSubmit={handleMedSubmit}/>
                    //<img className = "rm cabinet-open" src="images/cabinet/cabinet_open_tint.png"/>
                )}
            </div>
            
            {health <= 0 && (
                <div style={{display:"flex"}}>
                        <div>
                            You fucking died.
                            <button className="button" onClick={() => resetGame()}>Reset</button>
                        </div>
                </div>
            )}

        </div>
    );
}