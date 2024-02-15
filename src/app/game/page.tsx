"use client"
import {useState, useRef, useEffect} from "react"
import Bar from "./components/bar"
import './styles/game.scss'
import 'dotenv/config'
import { usePathname, useSearchParams } from 'next/navigation'
export default function Game() {
    const [date, setDate] = useState(new Date());

    const [points, setPoints] = useState(0);
    const [hunger, setHunger] = useState(0);
    const [happiness, setHappiness] = useState(100);
    const [health, setHealth] = useState(100);

    const childNumber = useRef("+16478184659");
    const parentNumber = useRef("+16478184659");
    const alertThreshold = useRef(30); //minutes

    const pathname = usePathname()
    const searchParams = useSearchParams()


    //Object array: {medication, time, is_taken, is_missed}
    const medlist = useRef(new Array());
    
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

    return(
        <div className="main--container">
            <div className="game--container">
                <div style={{display:"flex"}}>
                    <div className="points--container">{points}</div>
                    <Bar title="Hunger" percent={hunger}/>
                    <Bar title="Happiness" percent={happiness}/>
                    <Bar title="Health" percent={health}/>`
                </div>
                <div style={{display:"flex"}}>
                    <button className="button" onClick={() => tookMedication("")}>Take pill</button>
                    <button className="button" onClick={() => missedMedication("")}>Forget pill</button>
                </div>
                <div style={{display:"flex"}}>
                    {health <= 0 && (
                        <div>
                            You fucking died.
                            <button className="button" onClick={() => resetGame()}>Reset</button>
                        </div>
                    )}
                </div>
                <div>
                    <h1>This is how you access it</h1>
                    <p>Data: {searchParams.get('char')}</p>
                </div>
            </div>
        </div>
    );
}