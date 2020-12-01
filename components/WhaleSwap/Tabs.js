import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.ul`
  border: 1px solid var(--color-red1);
  border-radius: 12px;
  overflow: hidden;

  list-style: none;
  padding: 0;
  display: inline-flex;
  background: var(--color-white);

  li {
    width: 159px;
    font-size: 20px;
    line-height: 29px;
    padding: 7px;

    &.active {
      color: var(--color-white);
      background: var(--color-red1);
    }
  }
`

export default function Tabs({ tab, onTab, options }) {
  return (
    <Wrapper className="tabs center">
      {options.map(({ value, label }) => (
        <li key={value} onClick={() => onTab(value)} className={`cursor ${tab === value ? 'active' : ''}`}>
          {label}
        </li>
      ))}
    </Wrapper>
  )
}
