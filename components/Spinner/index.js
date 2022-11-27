import React from 'react'
import { CSSTransition } from 'react-transition-group'

export default function Spinner({ show }) {
  return (
    <CSSTransition
      classNames="spinner"
      timeout={{ enter: 200, exit: 200 }}
      in={show}
      unmountOnExit={true}
    >
      <div className="spinner"></div>
    </CSSTransition>
  )
}
