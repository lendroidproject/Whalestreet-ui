import React from 'react'
import styled from 'styled-components'

export const Overlay = styled.div`
  z-index: 11;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-opacity09);
`

export const Content = styled.div`
  border-radius: 8px;
  background: var(--color-grad2);
  box-shadow: var(--box-shadow1);

  padding: 35px 23px 30px;
  text-align: center;
  position: relative;
  width: 90%;

  h1 {
    font-size: 36px;
    font-weight: 600;
    color: var(--color-green);
    @media all and (max-width: 577px) {
      font-size: 30px;
    }
  }

  h3 {
    font-weight: normal;
  }

  .close {
    position: absolute;
    top: 20px;
    right: 22px;
    cursor: pointer;
    margin: 0;
  }
`

export default function Modal({ show, onClose, closeOnOutside, ...props }) {
  if (!show) return null
  return (
    <Overlay onClick={closeOnOutside && onClose} className="modal flex align-center justify-center">
      <Content onClick={(e) => e.stopPropagation()} {...props} />
    </Overlay>
  )
}
