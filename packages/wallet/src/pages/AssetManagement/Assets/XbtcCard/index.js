import React, { useState } from 'react'
import xbtcLogo from '../../../../static/xbtc.svg'
import { useSelector } from 'react-redux'
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
import { xbtcSelector } from '@reducers/assetSlice'

const XbtcCard = styled(Card)`
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
`

export default function() {
  const [transferOpen, setTransferOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const { details, precision, chain, total } = useSelector(xbtcSelector) || {}

  const handleTransferClose = () => setTransferOpen(false)
  const handleDepositClose = () => setDepositOpen(false)

  const Ops = (
    <div>
      <PrimaryButton
        // onClick={() => setDepositOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('DEPOSIT')}
      </PrimaryButton>
      <DefaultButton
        // onClick={() => setWithdrawOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('WITHDRAW')}
      </DefaultButton>
      <DefaultButton
        // onClick={() => setTransferOpen(true)}
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
                value={details.free}
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
      <Footer></Footer>

      {transferOpen && (
        <TransferDialog handleClose={handleTransferClose} token="BTC" />
      )}
      {depositOpen && <DepositDialog handleClose={handleDepositClose} />}
      {withdrawOpen && (
        <WithdrawDialog handleClose={() => setWithdrawOpen(false)} />
      )}
    </XbtcCard>
  )
}
