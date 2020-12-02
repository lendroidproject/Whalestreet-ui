import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: fixed;
  z-index: -101;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  background: transparent;
  transition: all 0.2s;

  &.show {
    z-index: 101;
    opacity: 1;
    background: var(--color-opacity09);
  }
`

const Content = styled.div`
  width: 90%;
  max-width: 608px;
  border-radius: 12px;
  background-color: var(--color-blue);
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5), 6px 2px 4px 0 rgba(0, 0, 0, 0.5);
  padding: 40px 30px 30px;

  h1 {
    margin-top: 24px;
    margin-bottom: 0;
    font-size: 24px;
    line-height: 36px;
    color: var(--color-yellow);
  }

  p {
    margin-top: 16px;
    margin-bottom: 0;
    font-size: 16px;
    line-height: 21px;
    max-width: 470px;
    color: var(--color-white);
  }
`

export default function Promo({ show, onHide }) {
  return ReactDOM.createPortal(
    <Wrapper className={`flex-all ${show ? 'show' : 'hide'}`} onMouseDown={() => onHide && onHide()}>
      <Content className="center flex-center flex-column justify-center">
        <img src="/assets/loading.gif" alt="WhaleStreet" />
        <h1>LOADING... PLEASE WAIT</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam,
          <br />
          <br />
        </p>
      </Content>
    </Wrapper>,
    document.body
  )
}
