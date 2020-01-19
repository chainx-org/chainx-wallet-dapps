import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import {
  fetchIntentions,
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;

  & > main {
    flex: 1;
  }
`

export default function() {
  const address = useSelector(addressSelector)
  const unFreezeRecord = useSelector(unFreezeRecordSelector)
  const voteOpen = useSelector(voteOpenSelector)
  const switchNominationOpen = useSelector(switchNominationOpenSelector)
  const unNominateOpen = useSelector(unNominateOpenSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSenators())
    dispatch(fetchIntentions())
    dispatch(fetchAssetsInfo())
    dispatch(fetchLogos())
    dispatch(fetchNominationRecords(address))
  }, [dispatch, address])

  return (
    <Wrapper className="staking">
      <Header />
      <Validators />
      {voteOpen ? <VoteDialog /> : null}
      {switchNominationOpen ? <SwitchDialog /> : null}
      {unNominateOpen ? <UnNominateDialog /> : null}
      <UnFreezeDialog
        record={unFreezeRecord}
        revocations={
          unFreezeRecord &&
          unFreezeRecord.info &&
          unFreezeRecord.info.revocations
        }
        handleClose={() => {
          dispatch(setUnFreezeOpen(false))
        }}
      />
    </Wrapper>
  )
}
