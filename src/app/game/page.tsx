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
import { useSearchParams } from "next/navigation"
import {slides} from "../slides"
import Questionnaire from "./components/Questionnaire"
import Store from "./components/store"

export default function Game() {

    const searchParams = useSearchParams();

    const [date, setDate] = useState(new Date());

    const [points, setPoints] = useState(0);
    const [hunger, setHunger] = useState(0);
    const [happiness, setHappiness] = useState(100);
    const [health, setHealth] = useState(100);

    const childID = useRef(-1);
    const childNumber = useRef("+16478184659");
    const parentNumber = useRef("+16478184659");
    const alertThreshold = useRef(30); //minutes
    const missThreshold = useRef(30); //minutes

    const medlist = useRef(new Array());

    //Misc page control variables
    const showModal = useRef(false);
    const showStore = useRef(false);
    const showQuestionnaire = useRef(false);
    const [selectedMed, setSelectedMed] = useState(-1);
    const [doorOpen, setDoorOpen] = useState(false);
    const [roomClass, setRoomClass] = useState("rm room--container room-closed");
    const [hoveredStoreItemID, setHoveredStoreItemID] = useState(-1);

    const left = useRef(new Array());

    const mounted = useRef(false);
    
    //Get game data
    useEffect(() => {
        if (!mounted.current) {
            const uname = searchParams.get("user");
            fetch("http://127.0.0.1:1492/children/byparent/" + uname, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPoints(data.Points);
                setHunger(data.Hunger);
                setHappiness(data.Happiness);
                setHealth(data.Health);
                childID.current = data.id;
                childNumber.current = data.Child_phone;
                parentNumber.current = data.Parent_phone;
                alertThreshold.current = data.Alert_threshold;
                missThreshold.current = data.Miss_threshold;

                //Process medication schedule data
                const medStringArray = data.Medicine_schedule.split(",");
                medStringArray.forEach((medString: String) => {
                    const params = medString.split(" - ");

                    const schedule_id = params[0];
                    const med_date = new Date(params[1]);
                    const med = params[2];
                    const dose = params[3];
                    const isTaken = params[4];

                    if (isTaken === "Not taken") medlist.current.push({schedule_id: schedule_id, medication: med, dose: dose, date: med_date, is_taken: false});
                });
            });
        }

        return () => {mounted.current = true};
    }, []);

    //Save the game if the game data changes
    useEffect(() => {
        saveGame();
    }, [points, hunger, happiness, health]);

    //Clock
    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate(new Date())
        }, 1000)
    
        return () => clearInterval(intervalId);
    });

    //Medication check
    useEffect(() => {

        left.current = new Array();

        for (var i = 0; i < medlist.current.length; i++) {
            const medication = medlist.current[i];
            const secondsLeft = Math.round((medication.date.valueOf() - date.valueOf()) / 1000);
            if (secondsLeft == Math.round(alertThreshold.current*60)) alertMedication(medication.medication);
            if (secondsLeft == Math.round(missThreshold.current*-60) && !medication.is_taken) missedMedication(medication.medication);
            left.current.push(secondsLeft);
        }
    }, [date]);

    //Happiness decrement
    useEffect(() => {
        const intervalId = setInterval(() => {
            setHappiness((happiness - 4 < 0)? 0: happiness - 4);
            // setHappiness((happiness + 8 > 100)? 100: happiness + 8);
        }, 60000)
    
        return () => clearInterval(intervalId);
    })

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

    function sendDailyReport() {
        const score = points*0.2 + happiness*0.2 + hunger*0.1 + health*0.5;
        const message_parent = 'Medibot end of day report: your child scored ' + score.toString() + ' points today.';
    }

    function alertMedication(med: string) {
        const message = "ECE498B Pending medication alert: to child"
        sendSMS(childNumber.current, message);
    }

    function saveGame() {
        fetch("http://127.0.0.1:1492/children/" + childID.current, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Points: points,
                Hunger: hunger,
                Happiness: happiness,
                Health: health,
            })
        })
        .then((response) => response.json())
        .then((data) => console.log(JSON.stringify(data)));
    }

    function tookMedication(mednum: number) {
        // Update TAKEN value for medication.
        fetch("http://127.0.0.1:1492/schedule/" + medlist.current[mednum].schedule_id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({taken: true})})
        .then((response) => response.json())
        .then((data) => {
            if(!data.error) {
            medlist.current[mednum].is_taken = true;
            setHunger((hunger - 25 < 0)? 0: hunger - 25);
            if (hunger <= 0) setPoints(points + 10);
            const message_parent = "Your child has taken their prescribed medication at the time of this message: " + medlist.current[mednum].medication + " (" + medlist.current[mednum].dose + ")."
            sendSMS(parentNumber.current, message_parent);
        }});

        medlist.current[mednum].is_taken = true;
    }
    
    function missedMedication(med: string) {
        const message_parent = "Your child has missed their prescribed medication at the time of this message: " + med + "."
        sendSMS(parentNumber.current, message_parent);

        const message_child = "You have just missed taking your " + med + ". Keep up with your prescription to gain points!"
        sendSMS(childNumber.current, message_child);

        setHunger((hunger + 25 > 100)? 100: hunger + 25);
        if (hunger >= 100) setHealth((health - 25 < 0)? 0: health - 25);
        if (health <= 0) setPoints((points - 10 < 0)? 0: points - 10);
    }

    function resetGame() {
        setPoints(0);
        setHunger(0);
        setHappiness(100);
        setHealth(100);
    }

    function handleMedSelect(mednum: number) {
        setSelectedMed(mednum);
    
        if (mednum == -1) {
            showQuestionnaire.current = false;
            showModal.current = false;
        } else {
            showQuestionnaire.current = true;
        }
    }

    function handleStoreSelect(id: number) {
        if (happiness < 100) {switch(id) {
            case 0:
                if(points >= 50) {
                    setHappiness((happiness + 50 > 100)? 100: happiness + 50);
                    setPoints((points - 30 < 0)? 0: points - 30);
                }
                break;
            case 1:
                if(points >= 10) {
                    setHappiness((happiness + 20 > 100)? 100: happiness + 20);
                    setPoints((points - 10 < 0)? 0: points - 10);
                }
                break;
            case 2:
                if(points >= 20)  {
                    setHappiness((happiness + 30 > 100)? 100: happiness + 30);
                    setPoints((points - 20 < 0)? 0: points - 20);
                }
                break;
            default:
                break;
        }}
        showStore.current = false;
    }

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

    function dayPeriodString() {
        var str1 = "";

        if(date.getHours() <= 11) str1 = "Good Morning!";
        else if (date.getHours() <= 15) str1 = "Good Afternoon!";
        else if (date.getHours() <= 21) str1 = "Good Evening!";

        return str1
    }

    function nextMedicationString() {
        if (medlist.current.length <= 0) return "You have no awaiting medications."
        var secondsLeft = left.current[0];
        for (var i = 0; i < medlist.current.length; i++) {
            if(!medlist.current[i].is_taken) {
                secondsLeft = left.current[i];
                break;
            }
            if(i == medlist.current.length-1) return "You have no awaiting medications."
        }

        for (var i = 0; i < left.current.length; i++) {
            if(medlist.current[i].is_taken) continue;
            if(left.current[i] > secondsLeft) secondsLeft = left.current[i];
        }

        if (secondsLeft < 0) {
            if (secondsLeft > -3600) {
                const minutesLeft = Math.round(-secondsLeft/60);
                return "You are " + minutesLeft.toString() + " minutes overdue on your last medication."
            } if (secondsLeft <= -3600) {
                const hoursLeft = Math.round(-secondsLeft/3600);
                return "You are " + hoursLeft.toString() + " hours overdue on your last medication."
            }
        }

        if (secondsLeft < 3600) {
            const minutesLeft = Math.round(secondsLeft/60);
            return "You have " + minutesLeft.toString() + " minutes until your next medication."
        } if (secondsLeft >= 3600) {
            const hoursLeft = Math.round(secondsLeft/3600);
            return "You have " + hoursLeft.toString() + " hours until your next medication."
        }

        return "You have no awaiting medications."
    }

    function getCharacterSprite() {
        const imgnum = searchParams.get("image");
        
        var imgurl = "";
        slides.forEach((slide) => {
            if (slide.id === imgnum) imgurl = slide.image;
        });

        return imgurl;
    }

    function storeCostMessage() {

        switch(hoveredStoreItemID) {
            case 0:
                    return "Cost: 30\tHappiness: +50"
                break;
            case 1:
                    return "Cost: 10\tHappiness: +20"
                break;
            case 2:
                    return "Cost: 20\tHappiness: +30"
                break;
            default:
                return "";
        }
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

            <div className="med-info--container">
                {!showQuestionnaire.current && !showStore.current && (
                    <>
                        <h1>{dateString()}</h1>
                        <h1>{dayPeriodString()}</h1>
                        <h1>{nextMedicationString()}</h1>
                    </>
                )}
                {showQuestionnaire.current && (<Questionnaire medication={medlist.current[selectedMed]} handleSubmit={() => tookMedication(selectedMed)}/>)}
                {showStore.current && (
                        <h1>{storeCostMessage()}</h1>
                )}
            </div>

            <div className={roomClass}>
                <img className="rm cabinet" src="images/cabinet/cabinet_closed_tint.png"/>
                <img className="rm cabinet-open" src="images/cabinet/cabinet_open_3.png" onClick={() => {showModal.current = true}}/>
                <img className="rm sprite" src={getCharacterSprite()}/>
                <button className="rm door-open-trigger" onClick={() => showStore.current = true} onMouseOver={() => setRoomClass("rm room--container room-open")} onMouseOut={() => setRoomClass("rm room--container room-closed")}/>

                {showModal.current && (
                    <MedModal medcount={medlist.current.length} handleSelect={(mednum:number) => {handleMedSelect(mednum)}} isTaken={(mednum:number) => {return medlist.current[mednum].is_taken}}/>
                )}
                {showStore.current && (
                    <div className="rm store_container">
                        <img className="rm store-item" src="images/hamburger.png" style={{top: "73.5%", left: "49%", opacity: (points < 50)? 0.5: 1}} onClick={() => handleStoreSelect(0)}
                            onMouseOver={() => setHoveredStoreItemID(0)} onMouseOut={() => setHoveredStoreItemID(-1)}/>
                        <img className="rm store-item" src="images/pizza.png" style={{top: "74%", left: "60%", opacity: (points < 10)? 0.5: 1}} onClick={() => handleStoreSelect(1)}
                            onMouseOver={() => setHoveredStoreItemID(1)} onMouseOut={() => setHoveredStoreItemID(-1)}/>
                        <img className="rm store-item" src="images/chickenburger.png" style={{top: "74%", left: "39%", opacity: (points < 20)? 0.5: 1}} onClick={() => handleStoreSelect(2)}
                            onMouseOver={() => setHoveredStoreItemID(2)} onMouseOut={() => setHoveredStoreItemID(-1)}/>
                        <img className="rm home-icon" src="images/home_icon.png" onClick={() => handleStoreSelect(-1)}/>
                    </div>
                )}
            </div>

        </div>
    );
}