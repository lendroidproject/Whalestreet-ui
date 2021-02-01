import styled from 'styled-components'

export const PageWrapper = styled.section`
  .watch-video {
    display: inline-flex;
    align-items: center;

    text-decoration: underline;
    color: var(--color-red);

    img {
      margin-right: 10px;
      @media all and (max-width: 577px) {
        height: 10px;
      }
    }
  }
`

export const Statics = styled.div`
  border-radius: 12px;
  background-color: var(--color-black);
  color: var(--color-white);
  max-width: 952px;
  margin: 0 auto 29px;
  padding: 11px 20px 7px;
  text-align: left;
  @media all and (max-width: 577px) {
    margin-bottom: 22px;
    padding: 7px 12px;
  }

  .statics__item {
    margin: 10px 20px;
    white-space: nowrap;
    @media all and (max-width: 577px) {
      margin: 5px 10px;
      width: calc(50% - 20px);
    }
  }

  &.b20-sale {
    text-align: center;
    font-size: 24px;
    padding: 20px 40px;
    display: inline-flex;

    span {
      margin: 0 5px;
    }

    .small {
      font-size: 16px;
    }
  }
`

export const OurTokens = styled.div`
  margin: 30px;

  h2 {
    color: var(--color-white);
    margin-bottom: 17px;
  }

  .buttons {
    flex-wrap: wrap;

    a button {
      margin: 0;
    }
  }

  a {
    margin: 5px 18px;
  }

  button {
    min-width: 100px;
    border-radius: 16px;
    box-shadow: var(--box-shadow);
    background-color: #0600cc;
    box-shadow: 1px 7px 3px 0 rgba(0, 0, 0, 0.5);

    font-size: 16px;
    line-height: 1;
    text-transform: uppercase;
    padding: 8px 10px;

    &:hover {
      background: var(--color-red);
    }
    @media all and (max-width: 577px) {
      font-size: 16px;
      line-height: 20px;
    }
  }
`
