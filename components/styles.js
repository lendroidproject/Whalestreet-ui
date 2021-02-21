import styled from 'styled-components'
import { mediaSize, withMedia, fontTitle, fontNormal } from 'utils/media'

export const PageWrapper = styled.section`
  .watch-video {
    display: inline-flex;
    align-items: center;

    text-decoration: underline;
    color: var(--color-red);

    img {
      margin-right: 10px;
      ${mediaSize.mobile} {
        height: 10px;
      }
    }
  }
`

export const Statics = styled.div`
  border-radius: 12px;
  background-color: var(--color-black);
  color: var(--color-white);
  margin: 0 auto 29px;
  padding: 11px 20px 7px;
  text-align: left;
  ${mediaSize.mobile} {
    margin-bottom: 22px;
    padding: 7px 12px;
    flex-direction: column;
    display: flex;
    align-items: center;
  }

  .statics__item {
    margin: 10px 20px;
    white-space: nowrap;

    ${mediaSize.mobile} {
      margin: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        margin-top: 0;
      }
    }
    span {
      font-size: 120%;
    }
  }

  &.b20-sale {
    text-align: center;
    ${fontTitle}
    padding: 20px 40px;
    display: inline-flex;

    span {
      margin: 0 5px;
    }

    .small {
      font-size: 66%;
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

    text-transform: uppercase;
    padding: 8px 10px;
    ${fontNormal}

    &:hover {
      background: var(--color-red);
    }
  }
`
