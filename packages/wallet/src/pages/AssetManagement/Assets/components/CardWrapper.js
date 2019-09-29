import Card from '../../../../components/Card'
import styled from 'styled-components'

export default styled(Card)`
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
