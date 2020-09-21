import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { noneFunc, retry } from '../../../../../utils'
import infoIcon from '../../../../../static/explan.svg'
import { PrimaryButton, TextInput } from '@chainx/ui'
import { CheckBox } from '../../../../../components'
import $t from '../../../../../locale'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { fetchValidators } from '@reducers/validatorSlice'

export default function({ handleClose = noneFunc }) {
  const accountAddress = useSelector(addressSelector)
  const [name, setName] = useState('')
  const [nameErrMsg, setNameErrMsg] = useState('')
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch()

  const register = async () => {
    if (name.length > 12) {
      setNameErrMsg($t('COMMON_TOO_LONG'))
      return
    }

    setDisabled(true)
    // add initvalue for register node
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xStaking',
        method: 'register',
        params: [name, 1000]
      })
      const messages = {
        successTitle: $t('staking_register_success'),
        failTitle: $t('staking_register_fail'),
        successMessage: `${$t('staking_register_nickname')} ${name.trim()}`,
        failMessage: ``
      }

      setDisabled(false)
      await showSnack(status, messages, dispatch)
      handleClose()
      retry(
        () => {
          dispatch(fetchValidators())
        },
        5,
        2
      ).then(() => console.log('Refresh intentions 5 times after create node'))
    } catch (e) {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog
      open
      title={$t('STAKING_REGISTER_INTENTION')}
      handleClose={handleClose}
    >
      <div className="wrapper">
        <p className="info">
          <img src={infoIcon} alt="info" />
          <span>唯一且不可更改，注册后不可转让</span>
        </p>
        <div>
          <TextInput
            value={name}
            onChange={v => setName((v || '').trim())}
            placeholder={$t('staking_validator_name_restriction')}
            error={!!nameErrMsg}
            errorText={nameErrMsg}
          />
        </div>
        <div>
          <CheckBox checked={checked} onClick={() => setChecked(!checked)}>
            <span className="read">我已阅读</span>
            <a href="https://github.com/chainx-org/ChainX/wiki/Join-ChainX-Mainnet">
              节点部署文档
            </a>
          </CheckBox>
        </div>

        <div>
          <PrimaryButton
            disabled={!checked || disabled}
            size="fullWidth"
            onClick={register}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </div>
    </StyledDialog>
  )
}
