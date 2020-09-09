import React, { useEffect, useState } from 'react'
import xbtcLogo from '../../../../static/xbtc.svg'
import { useDispatch, useSelector } from 'react-redux'
import InfoView from '../components/InfoView'
import $t from '../../../../locale'
import AssetView from '../components/AssetView'
import { AssetLine } from '../components/common'
import { DefaultButton, PrimaryButton } from '@chainx/ui'
import TransferDialog from '../../TransferDialog'
import DepositDialog from './DepositDialog'
import WithdrawDialog from './WithdrawDialog'
import Card from '@components/Card'
import styled from 'styled-components'
import Logo from '@pages/AssetManagement/Assets/components/Logo'
import {
  locksSelector,
  xbtcIdSelector,
  xbtcSelector
} from '@reducers/assetSlice'
import { addressSelector } from '@reducers/addressSlice'
import {
  fetchAccountMinerLedger,
  fetchClaimRestrictionOf,
  fetchInterestByAccount,
  xbtcInterestSelector
} from '@reducers/miningAssetSlice'
import { toPrecision } from '../../../../utils'
import { reachClaimHeightSelector } from '@pages/AssetManagement/Assets/XbtcCard/selectors'
import WarningPop from './WarningPop'
import warningIcon from './WarningPop/warning.svg'

const XbtcCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  header {
    padding: 16px 16px 12px;
    opacity: 0.72;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0.14px;
    line-height: 24px;
    border-bottom: 1px solid #eeeeee;
  }
`

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Title = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 16px;

  & > div:last-of-type {
    display: flex;
    align-items: center;
  }
`

const Line = styled.section`
  padding: 0 16px;
  margin-top: 16px;
`

const Footer = styled.footer`
  border-top: 1px solid #eeeeee;
  min-height: 60px;
  padding: 0 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  span.info {
    display: inline-flex;
    align-items: center;
  }

  span.label {
    opacity: 0.32;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
  }

  span.interest {
    margin-left: 16px;
    opacity: 0.72;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 24px;
  }

  span.warning {
    display: inline-flex;
    align-items: center;
    img {
      margin-left: 6px;
      width: 16px;
    }
  }
`

export default function() {
  const [transferOpen, setTransferOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [openPop, setOpenPop] = useState(false)
  const { details, precision, chain, total } = useSelector(xbtcSelector) || {}
  const dispatch = useDispatch()
  const address = useSelector(addressSelector)
  const xbtcId = useSelector(xbtcIdSelector)

  const { Bonded: bonded } = useSelector(locksSelector)

  const xbtcInterest = useSelector(xbtcInterestSelector)
  const hasEnoughStaking = bonded > (xbtcInterest * 100) / 9

  const reachClaimHeight = useSelector(reachClaimHeightSelector)
  const canClaim = reachClaimHeight && hasEnoughStaking

  useEffect(() => {
    if (xbtcId) {
      dispatch(fetchClaimRestrictionOf(xbtcId))
    }
  }, [dispatch, xbtcId])

  useEffect(() => {
    dispatch(fetchAccountMinerLedger(address))

    const intervalId = setInterval(() => {
      dispatch(fetchInterestByAccount(address))
    }, 6000)

    return () => clearInterval(intervalId)
  }, [dispatch, address])

  const handleTransferClose = () => setTransferOpen(false)
  const handleDepositClose = () => setDepositOpen(false)

  const Ops = (
    <div>
      <PrimaryButton
        onClick={() => setDepositOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('DEPOSIT')}
      </PrimaryButton>
      <DefaultButton
        onClick={() => setWithdrawOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('WITHDRAW')}
      </DefaultButton>
      <DefaultButton
        onClick={() => setTransferOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('TRANSFER')}
      </DefaultButton>
    </div>
  )

  return (
    <XbtcCard>
      <header>{$t('psedu_asset')}</header>
      <Content>
        <Title>
          <Logo logo={xbtcLogo} tokenName="ChainX Bitcoin" name="XBTC" />
          {Ops}
        </Title>
        {details && (
          <>
            <Line>
              <AssetView
                title={$t('ASSET_FREE')}
                value={details.usable}
                precision={precision}
                disabled={false}
                bold
              />
            </Line>
            <Line>
              <AssetLine>
                <InfoView title={$t('ASSET_CHAIN')} info={chain} />
                <AssetView
                  title={$t('ASSET_RESERVED_WITHDRAWAL')}
                  value={details.reservedWithdrawal}
                  precision={precision}
                />
                <AssetView
                  title={$t('ASSET_RESERVED_DEX_SPOT')}
                  value={details.reservedDexSpot}
                  precision={precision}
                />
                <AssetView
                  title={$t('ASSET_TOTAL')}
                  value={total}
                  precision={precision}
                />
              </AssetLine>
            </Line>
          </>
        )}
      </Content>
      <Footer>
        <span className="info">
          <span className="label">{$t('PSEDU_MINING_INTEREST')}</span>
          <span className="interest">
            {toPrecision(xbtcInterest, precision)} PCX
          </span>
          {xbtcInterest > 0 && !canClaim ? (
            <span className="warning" onMouseEnter={() => setOpenPop(true)}>
              <img src={warningIcon} alt="interest" />
            </span>
          ) : null}
        </span>

        <PrimaryButton
          disabled={!reachClaimHeight || !hasEnoughStaking}
          size="small"
          onClick={() => console.log('claim TODO')}
        >
          {$t('PSEDU_CLAIM')}
        </PrimaryButton>
      </Footer>

      {openPop && <WarningPop close={() => setOpenPop(false)} />}

      {transferOpen && (
        <TransferDialog handleClose={handleTransferClose} token="XBTC" />
      )}
      {depositOpen && <DepositDialog handleClose={handleDepositClose} />}
      {withdrawOpen && (
        <WithdrawDialog handleClose={() => setWithdrawOpen(false)} />
      )}
    </XbtcCard>
  )
}
