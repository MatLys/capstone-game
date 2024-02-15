'use client'

import React, { memo, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// import VolumeBtn from '@component/app/components/volume-btn'
// import InfoBtn from '@component/app/components/info-btn'
// import Balance from '@component/app/components/balance'

function Header() {
  const [colored, setColored] = useState(false)


  return (
    <header className={"head"}>
      <div className='logo--container'>
        <Image src={'/characters/image.png'} alt='Logo' width={30} height={30}/>
        <Link href='/'>Test</Link>
        {/* <VolumeBtn/>
        <InfoBtn/> */}
      </div>
      <nav className='header--nav'>
        <ul>
          <li>
            {/* Might replace with exit button and function to save. No need home  */}
            <Link href='/game'>Home</Link>
          </li>
          <li>
            {/* Might include this game details? */}
            <Link href='/about'>About</Link>
          </li>
          {/* <Balance/> */}
        </ul>
      </nav>
    </header>
  )
}

export default memo(Header)

