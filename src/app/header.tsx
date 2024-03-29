'use client'

import React, { memo, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
const audio = new Audio('/game-asset/music.mp3'); // replace with your audio file path
audio.loop = true; // This will make the audio repeat

function Header() {
  const [colored, setColored] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleReload = () => {
    window.location.href = '/earn';
  };
  
  return (
    <header className={"head"}>
      <div className='logo--container'>
        <Image src={'/characters/image.png'} alt='Logo' width={30} height={30}/>
        <Link href='/'>MediPet</Link>

        <button onClick={togglePlayPause}>
        <img src={isPlaying ? '/game-asset/volume.png' : '/game-asset/volumeoff.png'} alt="Volume control" width={30} height={30} />
      </button>
      </div>
      <nav className='header--nav'>
        <ul>
          <li>
            {/* Might replace with exit button and function to save. No need home  */}
            <Link href='/earn'>Earn</Link>
          </li>
          <li>
            {/* Might include this game details? */}
            <Link href='http://localhost:8000/index.html'>About</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default memo(Header)

