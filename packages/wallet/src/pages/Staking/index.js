import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import {
  fetchIntentions,
  fetchSenators,
  fetchLogos,
  fetchNominationRecords
} from '../../reducers/intentionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssetsInfo } from '../../reducers/assetSlice'
import styled from 'styled-components'
import { addressSelector } from '../../reducers/addressSlice'
import {
  setSwitchNominationOpen,
  setVoteOpen,
  switchNominationDataSelector,
  switchNominationOpenSelector,
  voteIntentionSelector,
  voteOpenSelector
} from '../../reducers/runStatusSlice'
import VoteDialog from './VoteDialog'
import SwitchDialog from './SwitchDialog'

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
  const voteOpen = useSelector(voteOpenSelector)
  const voteIntention = useSelector(voteIntentionSelector)
  const switchNominationOpen = useSelector(switchNominationOpenSelector)
  const switchNominationData = useSelector(switchNominationDataSelector)

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
      {voteOpen && (
        <VoteDialog
          handleClose={() => dispatch(setVoteOpen(false))}
          intention={voteIntention}
        />
      )}
      {switchNominationOpen ? (
        <SwitchDialog
          intention={switchNominationData.intention}
          nomination={switchNominationData.nomination}
          handleClose={() => dispatch(setSwitchNominationOpen(false))}
        />
      ) : null}
    </Wrapper>
  )
}
