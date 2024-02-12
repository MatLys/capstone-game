import React from 'react'

import { ProgressBar } from '@codecademy/gamut'
import '../styles/game.scss';

interface BarProps {
  title: string
  percent: number
}

export default function Bar( { title, percent }: BarProps ) {
  return (
    <div className={'bar--container'}>
      <h4 style={{ alignSelf: 'start' }}>{title}</h4>
      <div className={'bar'}>
        <ProgressBar percent={percent} variant='yellow' size='small'/>
      </div>
    </div>
  )
}