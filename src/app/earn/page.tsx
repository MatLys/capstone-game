"use client"

import { useState, useEffect } from "react";
import './styles/game.scss';
import 'dotenv/config';

type Fruit = {
  id: number;
  x: number;
  y: number;
  speed: number;
  acceleration: number;
  type: string;
  color: string;
  flavor: string;
};

export default function Game() {
  const [score, setScore] = useState(0);
  const [basketPosition, setBasketPosition] = useState(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);

  useEffect(() => {
    const moveFruits = setInterval(() => {
      setFruits(prevFruits =>
        prevFruits.map(fruit => ({
          ...fruit,
          y: fruit.y + fruit.speed,
          speed: fruit.speed + fruit.acceleration,
        }))
      );
    }, 100);

    return () => {
      clearInterval(moveFruits);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newFruit: Fruit = {
        id: Date.now(),
        x: Math.random() * 500,
        y: 80,
        speed: 0,
        acceleration: 0.1,
        type: 'apple',
        color: 'blue',
        flavor: 'sweet'
      };
      setFruits(prevFruits => [...prevFruits, newFruit]);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newBasketPosition = Math.max(0, Math.min(e.clientX, 500));
      setBasketPosition(newBasketPosition);

      const fruitsToRemove: number[] = [];
      fruits.forEach(fruit => {

        if (fruit.y >= 840 && fruit.x >= basketPosition && fruit.x <= basketPosition + 100) {
          setScore(prevScore => prevScore + 1);
          fruitsToRemove.push(fruit.id);
        } else if (fruit.y >= 840 ) {
            fruitsToRemove.push(fruit.id);
        }
      });
      setFruits(prevFruits => prevFruits.filter(fruit => !fruitsToRemove.includes(fruit.id)));
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [basketPosition, fruits]);

  return (
    <div>
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '90vh', width: '100%', border: '1px solid black', overflow: 'hidden' }}>
          <div style={{ height: '20px', width: '100px', backgroundColor: 'black', position: 'absolute', bottom: 0, left: basketPosition }} />
          {fruits.map(fruit => (
            <div key={fruit.id} style={{ height: '20px', width: '20px', backgroundColor: 'blue', position: 'absolute', left: fruit.x, top: fruit.y }} />
          ))}
        </div>
        <div style={{ height: '4vh', width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', fontSize: '30px',position: 'relative',
    top: '-890px' }}>
          Score: {score}
        </div>
      </div>
    </div>
  );
}