import styled from 'styled-components'

export const DetailWrapper = styled.div`
  & > div:not(:first-of-type) {
    margin-top: 16px;
  }
`

export const AssetLine = styled.div`
  display: flex;
  & > div {
    flex: 1;
  }
`
