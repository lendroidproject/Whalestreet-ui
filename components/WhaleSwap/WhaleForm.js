import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const From = styled.div`
  .row {
  }
`

export default function WhaleForm({ title, logo, currencies, liqudates, ...props }) {
  const [form, setForm] = useState({
    name: '',
    commission: '',
    date: '',
    currency1: '',
    currency2: '',
    liquidate: '',
  })

  return (
    <Wrapper>
      <Title>
        <img src={logo} alt="" />
        <h2>{title}</h2>
      </Title>
      <Form>
        <div className="row">
          <div className="input">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} />
          </div>
          <div className="input">
            <label htmlFor="commission">Commission</label>
            <input id="commission" name="commission" value={form.commission} />
          </div>
        </div>
        <div className="row">
          <div className="input">
            <label htmlFor="date">Swap Date</label>
            <input id="date" name="date" value={form.date} />
          </div>
        </div>
        <div className="row">
          <div className="input">
            <label htmlFor="currency1">Currency 1</label>
            <select id="currency1" name="currency1" value={form.currency1}>
              {currencies.map((item) => (
                <option value={item.address}>{item.symbol}</option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="currency2">Currency 2</label>
            <select id="currency2" name="currency2" value={form.currency2}>
              {currencies.map((item) => (
                <option value={item.address}>{item.symbol}</option>
              ))}
            </select>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="input">
            <label htmlFor="liquidate">Liquidatable</label>
            <select id="liquidate" name="liquidate" value={form.liquidate}>
              {currencies.map((item) => (
                <option value={item.address}>{item.symbol}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="footer">
          <button>Cancel</button>
          <button>Activate</button>
        </div>
      </Form>
    </Wrapper>
  )
}
