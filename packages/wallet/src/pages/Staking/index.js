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
  setSwitchNominationOpen,
  setUnFreezeOpen,
  switchNominationDataSelector,
  switchNominationOpenSelector,
  unFreezeRecordSelector
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
  const switchNominationOpen = useSelector(switchNominationOpenSelector)
  const switchNominationData = useSelector(switchNominationDataSelector)
  const unFreezeRecord = useSelector(unFreezeRecordSelector)

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
      <VoteDialog />
      {switchNominationOpen ? (
        <SwitchDialog
          intention={switchNominationData.intention}
          nomination={switchNominationData.nomination}
          handleClose={() => dispatch(setSwitchNominationOpen(false))}
        />
      ) : null}
      <UnNominateDialog />
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
