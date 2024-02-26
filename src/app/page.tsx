'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import Carousel from './carousel/carousel'
import { Slide, slides } from './slides'
import { Character } from './character'

import styles from './home.module.scss'


export default function CreateCharacter() {
  const router = useRouter()
  const [showHeart, setShowHeart] = useState(true)
  const showHeartRef = useRef(showHeart)
  const [selectedSlide, setSelectedSlide] = useState(slides[0])
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')


  const handleChangeName = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const { value } = e.target
    setusername(value)
  }
  const handleChangePass = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const { value } = e.target
    setpassword(value)
  }

  useEffect(() => {
    showHeartRef.current = showHeart
  }, [showHeart])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop
      if (scrollPosition < 100 !== showHeartRef.current) {
        setShowHeart(scrollPosition < 100)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch('https://api.npms.io/v2/invalid-url', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ param1: username, param2: username }), // Convert parameters to JSON string
    }).then(async response => {
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || response.statusText);
                return;
            }

            let user = username;
            let charname = selectedSlide.charname;
            let image = selectedSlide.id
            const url = `/game?user=${user}&char=${charname}&image=${image}`;

            router.push(url);

        })
        .catch(error => {
            console.error('There was an error!', error);
        });

  };

  return (
    <form className={`${styles['character-page']}`}

          onSubmit={handleSubmit}>

      {errorMessage && (
        <div className="popup-box">
          <div className="popup">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage('')}>Close</button>
          </div>
        </div>
      )}
      <Image className={styles['html']} src={'/game-asset/banner.png'} alt='Banner' width={700} height={423} style={{ marginLeft: '550px' }}/>

      <div className={styles['textboxName']}>
        <h2>Username</h2>
        <input
          type='text'
          placeholder='Enter your user name'
          value={username}
          onChange={handleChangeName}
          maxLength={24}
        />
      </div>

      <div className={styles['textboxPass']}>
        <h2>Password</h2>
        <input
          type='text'
          placeholder='Enter your password'
          value={password}
          onChange={handleChangePass}
          maxLength={24}
        />
      </div>

      <div className={styles['character']}>
        <h2>Choose a character to play!</h2>
        <Carousel
          value={selectedSlide}
          onChange={( value ) => {
            setSelectedSlide(value)
          }}
          slides={slides}
          
        >
          
          {( slide, isSelected ) => (
            <div
              key={slide.id}
              className={styles['slide-box']}
            >
              <Image
                className={`${styles['slide-image']} ${
                  isSelected ? styles.element__selected : ''
                }`}
                src={slide.image}
                alt={slide.charname}
                width={238}
                height={160}
                priority
              />
              <h3 style={{ color: isSelected ? 'Green' : 'black', fontWeight: isSelected ? 'bold' : 'bold' }}> {slide.charname}</h3>

            </div>        
          )}
        </Carousel>
        <button className={styles['start-button']} type='submit'>
          <Image className={styles['start-image']} src={'/game-asset/start.png'} alt='Start' width={160} height={66}/>
        </button>
      </div>
    </form>
  )
}

