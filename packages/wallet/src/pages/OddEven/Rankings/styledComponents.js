import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 300px;
  margin-left: 16px;
  display: flex;
  flex-direction: column;

  & > div {
    flex: 1;

    &:last-of-type {
      margin-top: 18px;
    }
  }

  ol,
  li {
    margin: 0;
    padding: 0;
  }
`

export const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;

  & > header {
    span {
      opacity: 0.72;
      font-weight: 600;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
    }
    padding: 10px 16px;
    border-bottom: 1px solid #eeeeee;
  }

  ol li {
    display: flex;
    justify-content: space-between;

    &:not(:last-of-type) {
      border-bottom: 0.5px solid #eeeeee;
    }

    span {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.72);
      letter-spacing: 0.2px;
      line-height: 16px;

      &:last-of-type {
        margin-right: 16px;
      }
    }
  }
`

export const EvenPanel = styled(Panel)`
  li > span:first-of-type {
    &:before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 22px;
      background: #0086dc;
      margin-right: 12px;
    }
  }
`

export const OddPanel = styled(Panel)`
  li > span:first-of-type {
    &:before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 22px;
      background: #e05300;
      margin-right: 12px;
    }
  }
`
