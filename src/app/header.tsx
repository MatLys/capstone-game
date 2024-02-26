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
  return (
    <header className={"head"}>
      <div className='logo--container'>
        <Image src={'/characters/image.png'} alt='Logo' width={30} height={30}/>
        <Link href='/'>MediPet</Link>

        <button onClick={togglePlayPause}>
        <img src={isPlaying ? '/game-asset/volume.svg' : '/game-asset/volumeoff.svg'} alt="Volume control" />
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
            <Link href='/the about page'>About</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default memo(Header)

