import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import {
  fetchLogos,
  fetchNominationRecords,
  fetchSenators
} from '../../reducers/intentionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssetsInfo } from '../../reducers/assetSlice'
import styled from 'styled-components'
import { addressSelector } from '../../reducers/addressSlice'
import {
  setUnFreezeOpen,
  switchNominationOpenSelector,
  unFreezeRecordSelector,
  unNominateOpenSelector,
  voteOpenSelector
} from '../../reducers/runStatusSlice'
import VoteDialog from './VoteDialog'
import SwitchDialog from './SwitchDialog'
import UnNominateDialog from './UnNominateDialog'
import UnFreezeDialog from './UnfreezeDialog'
import { getApi } from '../../services/api'
import {
  fetchAccountNominationInterest,
  fetchAccountNominations,
  fetchValidators
} from '@reducers/validatorSlice'

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
  // const switchNominationOpen = useSelector(switchNominationOpenSelector)
  // const unNominateOpen = useSelector(unNominateOpenSelector)
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
    dispatch(fetchAccountNominationInterest(address))
  }, [dispatch, address])

  useEffect(() => {
    dispatch(fetchValidators())
  }, [dispatch])

  return (
    <Wrapper className="staking">
      <Header />
      <Validators />
      {voteOpen ? <VoteDialog /> : null}
      {/*{switchNominationOpen ? <SwitchDialog /> : null}*/}
      {/*{unNominateOpen ? <UnNominateDialog /> : null}*/}
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
