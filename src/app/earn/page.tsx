"use client"

import { useState, useEffect } from "react";
import 'dotenv/config';

type Fruit = {
  id: number;
  x: number;
  y: number;
  speed: number;
  acceleration: number;
};

export default function FruitGame() {
  const [score, setScore] = useState(0);
  const [catchPosition, setcatchPosition] = useState(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
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
        x: Math.random() * 1820,
        y: 90,
        speed: 2,
        acceleration: Math.random(),
      };
      setFruits(prevFruits => [...prevFruits, newFruit]);
    }, 700);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const catchPosition = Math.max(0, Math.min(e.clientX, 1820));
      setcatchPosition(catchPosition);

      const fruitsToRemove: number[] = [];
      fruits.forEach(fruit => {

        if (fruit.y >= 800 && fruit.x >= catchPosition && fruit.x <= catchPosition + 100) {
          setScore(prevScore => prevScore + 1);
          fruitsToRemove.push(fruit.id);
        } else if (fruit.y >= 800 ) {
            fruitsToRemove.push(fruit.id);
        }
      });
      setFruits(prevFruits => prevFruits.filter(fruit => !fruitsToRemove.includes(fruit.id)));
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [catchPosition, fruits]);

  useEffect(() => {
    if (score >= 20) {
      setGameOver(true);
      setMessage('You reached a score of 20! GAME OVER!');
    }
  }, [score]);

  const handleRedirect = () => {
    // Perform redirection logic here
    window.location.href = '/game';
  };

  return (
    <div>
      <style>
        {`
          body {
            background-image: url('/game-asset/background.jpg');
            background-size: cover;
            background-position: center;
            margin: 0;
            padding: 0;
          }
        `}
      </style>

      {gameOver && (
        <div className="popup-box">
          <div className="popup">
          <p>{message}</p>
          <button className="popup button"  onClick={handleRedirect}>Exit</button>
          </div>
        </div>
      )}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', bottom: 0, left: catchPosition }}>
          <img src="/characters/spb1.png" alt="Basket" style={{ height: '80px', width: '80px' }} />
        </div>        
      {fruits.map(fruit => (
          <div key={fruit.id} style={{ position: 'absolute', left: fruit.x, top: fruit.y, height: '50px', width: '50px'}}>
            {fruit.id % 9 === 1 && <img src="/game-asset/watermelon.svg" alt="Fruit 1" style={{ height: '53px', width: '53px' }} />}
            {fruit.id % 9 === 2 && <img src="/game-asset/guava.svg" alt="Fruit 2" style={{ height: '50px', width: '50px' }} />}
            {fruit.id % 9 === 3 && <img src="/game-asset/pineapple.svg" alt="Fruit 3" style={{ height: '70px', width: '70px' }} />}
            {fruit.id % 9 === 0 && <img src="/game-asset/grape.svg" alt="Fruit 4" style={{ height: '55px', width: '55px' }} />}
            {fruit.id % 9 === 4 && <img src="/game-asset/coconut.svg" alt="Fruit 4" style={{ height: '50px', width: '50px' }} />}
            {fruit.id % 9 === 5 && <img src="/game-asset/orange.svg" alt="Fruit 4" style={{ height: '50px', width: '50px' }} />}
            {fruit.id % 9 === 6 && <img src="/game-asset/strawberry.svg" alt="Fruit 4" style={{ height: '50px', width: '50px' }} />}
          </div>
        ))}
      </div>
      <div style={{ height: '4vh', width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', fontSize: '30px', position: 'relative', top: '-982px' }}>
        Score: {score}
      </div>
    </div>
  );
}