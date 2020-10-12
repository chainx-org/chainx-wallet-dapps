import React, { useState } from 'react'
import styled from 'styled-components'
import Header from './Header'
import Overview from './Overview'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;
`

export default function() {
  const [idx, setIdx] = useState(0)

  // const address = useSelector(addressSelector)
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(getAccountOrders(address))
  // }, [dispatch, address])

  return (
    <Wrapper style={{ marginTop: 18 }}>
      <Header idx={idx} setIdx={setIdx} />
      {idx === 0 ? <Overview /> : null}
    </Wrapper>
  )
}
