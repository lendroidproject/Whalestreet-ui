import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import YouTube from 'react-youtube'

const Wrapper = styled.div`
  position: fixed;
  z-index: -101;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  transition: all 0.2s;
  background: rgba(0, 0, 0, 0);

  &.show {
    z-index: 101;
    opacity: 1;
    background: rgba(0, 0, 0, 0.92);
  }
`

export default function Promo({ show, onHide }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    setWidth(Math.min(window.innerWidth * 0.9, 640))
    window.onresize = () => {
      setWidth(Math.min(window.innerWidth * 0.9, 640))
    }
    return () => delete window.onresize
  }, [])

  return ReactDOM.createPortal(
    <Wrapper className={`flex-all ${show ? 'show' : 'hide'}`} onMouseDown={onHide}>
      {width > 0 && (
        <YouTube
          videoId="gke51eP5piY"
          opts={{ playerVars: { autoplay: 0 }, width, height: (width * 360) / 640 }}
          className="video"
          onMouseDown={(e) => e.preventDefault()}
        />
      )}
    </Wrapper>,
    document.body
  )
}
