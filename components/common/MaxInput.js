import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  text-align: left;
  max-width: 300px;

  label + .input-field {
    margin-top: 4px;
  }

  input {
    width: 100%;
    padding: 5px 0;
    font-size: 24px;
    letter-spacing: 0;
    line-height: 37px;
    border: 0;
    border-bottom: 1px solid var(--color-button-border);
    outline: none;

    background: transparent;
    color: var(--color-white);
  }

  button {
    border-radius: 6px;
    background-color: var(--color-button-back);
    color: var(--color-black);
    font-weight: normal;
    padding: 7px 15px;
    margin-left: 9px;

    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
  }
`

const MaxInput = ({ label, wrapperClass = '', children, onMax, ...props }) => {
  return (
    <Wrapper className={`input ${wrapperClass}`}>
      {label && <label>{label}</label>}
      <div className="input-field flex-end">
        <input {...props} type="number" />
        <button onClick={onMax} type="button">
          Max
        </button>
      </div>
    </Wrapper>
  )
}

export default MaxInput
