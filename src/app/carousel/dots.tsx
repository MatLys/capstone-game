import React from 'react'
import classnames from 'classnames'

import styles from './carousel.module.scss'

type Props = {
  items: number;
  active: number;
};

function Dots( { items, active }: Props ) {
  return (
    <ul className={styles.dotList}>
      {Array.from(Array(items).keys()).map(( dot: number ) => (
        <li
          key={dot}
          className={classnames(styles.dot, {
            [styles.active]: active === dot,
          })}
        />
      ))}
    </ul>
  )
}

export default React.memo(Dots)