import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding-top: unset !important;
  margin: unset;
  width: 100%;
`

export const Header = styled.header`
  display: flex;
  background: rgba(255, 255, 255, 0.85);
  height: 56px;
  padding: 0 16px;

  dl,
  dt,
  dd {
    display: inline-flex;
  }

  dl {
    align-items: center;
    font-weight: 600;
    margin-left: 160px;
  }

  dt {
    margin-left: 8px;
    opacity: 0.72;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
  dd {
    margin-left: 4px;
    font-size: 14px;
    color: #0088cc;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
`

export const Main = styled.main`
  padding-top: 16px;
  margin: 0 auto;
  min-width: 1280px;
  max-width: 1440px;

  display: flex;
  flex: 1;
`

export const BetArea = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;

  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 40px;
    background-image: linear-gradient(270deg, #cebe9e 1%, #bba383 98%);
    border-radius: 10px 10px 0 0;

    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.12px;
    line-height: 24px;
  }

  main {
    flex: 1;
    padding-bottom: 24px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h3 {
      max-width: 266px;
      margin: 56px 0;
      font-weight: 600;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0.15px;
      text-align: center;
      line-height: 32px;
      & > span {
        color: #af9471;
        &.height {
          color: #0088cc;
        }
      }
    }

    footer {
      opacity: 0.56;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      text-align: center;
      line-height: 20px;
    }
  }
`

export const MyBets = styled.section`
  width: 300px;

  margin-left: 16px;

  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;
`
