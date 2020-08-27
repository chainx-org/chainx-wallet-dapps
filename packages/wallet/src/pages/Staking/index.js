import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { addressSelector } from '../../reducers/addressSlice'
import { voteOpenSelector } from '../../reducers/runStatusSlice'
import VoteDialog from './VoteDialog'
import {
  fetchAccountNominationInterest,
  fetchAccountNominations,
  fetchBondingDuration,
  fetchNominatorInfo,
  fetchValidators
} from '@reducers/validatorSlice'
import {
  switchNominationOpenSelector,
  unNominateOpenSelector
} from '@reducers/runStatusSlice'
import UnNominateDialog from './UnNominateDialog'
import SwitchDialog from './SwitchDialog'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;

  & > main {
    flex: 1;
  }
`

export default function() {
  const address = useSelector(addressSelector)
  // const unFreezeRecord = useSelector(unFreezeRecordSelector)
  const voteOpen = useSelector(voteOpenSelector)
  const switchNominationOpen = useSelector(switchNominationOpenSelector)
  const unNominateOpen = useSelector(unNominateOpenSelector)
  // const api = getApi()

  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchSenators())
  //   dispatch(fetchAssetsInfo())
  //   dispatch(fetchLogos())
  // }, [dispatch, api])
  //
  useEffect(() => {
    dispatch(fetchAccountNominations(address))
    dispatch(fetchNominatorInfo(address))
  }, [dispatch, address])

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchAccountNominationInterest(address))
    }, 6000)

    return () => window.clearInterval(intervalId)
  }, [dispatch, address])

  useEffect(() => {
    dispatch(fetchValidators())
    dispatch(fetchBondingDuration())
  }, [dispatch])

  return (
    <Wrapper className="staking">
      <Header />
      <Validators />
      {voteOpen ? <VoteDialog /> : null}
      {switchNominationOpen ? <SwitchDialog /> : null}
      {unNominateOpen ? <UnNominateDialog /> : null}
      {/*<UnFreezeDialog*/}
      {/*  record={unFreezeRecord}*/}
      {/*  revocations={*/}
      {/*    unFreezeRecord &&*/}
      {/*    unFreezeRecord.info &&*/}
      {/*    unFreezeRecord.info.revocations*/}
      {/*  }*/}
      {/*  handleClose={() => {*/}
      {/*    dispatch(setUnFreezeOpen(false))*/}
      {/*  }}*/}
      {/*/>*/}
    </Wrapper>
  )
}
