import React, { useEffect, useState } from 'react'
import Dots from './dots'
import PrevButton from './prev-button'
import NextButton from './next-button'

import styles from './carousel.module.scss'

type Props<T> = {
  slides: T[]
  children: ( item: T, isSelected: boolean ) => JSX.Element
  visibleItemsNumber?: number
  value: T
  onChange: ( value: T ) => void
}

function Carousel<T>( {
  slides,
  children,
  visibleItemsNumber = 3,
  value,
  onChange,
}: Props<T> ) {
  const [start, setStart] = useState(() => slides.indexOf(value))
  const [selectedItem, setSelectedItem] = useState(value)

  useEffect(() => {
    const center = Math.floor(visibleItemsNumber / 2)
    const newIndex =
      start + center < slides.length
        ? start + center
        : ( start + center ) - slides.length
    setSelectedItem(slides[newIndex])
    onChange(slides[newIndex])
  }, [start, slides, onChange, visibleItemsNumber])

  const isControlsVisible = slides.length > visibleItemsNumber

  const visibleItems = isControlsVisible
    ? slides
      .concat(slides.slice(0, visibleItemsNumber))
      .slice(start, start + visibleItemsNumber)
    : slides

  const onNextClick = () => {
    setStart(start + 1 >= slides.length ? 0 : start + 1)
  }

  const onPrevClick = () => {
    setStart(start - 1 >= 0 ? start - 1 : slides.length - 1)
  }

  const clickSlide = ( item: T ) => {
    const clicked = slides.indexOf(item)
    const subtrahend = Math.floor(visibleItemsNumber / 2)
    if (clicked - subtrahend < 0) setStart(slides.length - Math.abs(clicked - subtrahend))
    else setStart(clicked - subtrahend)
  }

  return (
    <div>
      <div className={styles.slides}>
        {isControlsVisible && (
          <PrevButton onClick={onPrevClick} className={styles.navButtonPre}/>
        )}

        <ul className={styles.list}>
          {visibleItems.map(( item, index ) => (
            <li key={index} onClick={() => {
              clickSlide(item)
            }}>
              {children(item, item === selectedItem)}
            </li> ))}
        </ul>

        {isControlsVisible && (
          <NextButton onClick={onNextClick} className={styles.navButtonNex}/>
        )}
      </div>

      {isControlsVisible && (
        <div className={styles.dotsControls}>
          <Dots
            items={slides.length}
            active={start}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(Carousel) as typeof Carousel
