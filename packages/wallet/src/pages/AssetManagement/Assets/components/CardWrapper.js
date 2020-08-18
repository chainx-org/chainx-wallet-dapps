import Card from '../../../../components/Card'
import styled, { css } from 'styled-components'

export default styled(Card)`
  ${props =>
    props.disabled &&
    css`
      background: unset;
    `};

  height: 300px;
  position: relative;

  & > div {
    margin-top: 16px;
  }

  & > hr {
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    border: 0.5px solid #eee;
  }

  & > footer {
    position: absolute;
    bottom: 0;
    height: 60px;
  }
`
