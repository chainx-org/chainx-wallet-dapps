import React from 'react'
import { DefaultButton, PrimaryButton } from '@chainx/ui'
import $t from '../../locale'

export default function({ withdraw }) {
  return (
    <div style={{ marginLeft: 16 }}>
      <PrimaryButton
        style={{ backgroundColor: '#0086DC', color: '#FFF', fontWeight: 600 }}
        onClick={() => {
          console.log('deposit')
        }}
      >
        {$t('DEPOSIT')}
      </PrimaryButton>
      <DefaultButton
        style={{
          backgroundColor: '#E05300',
          color: '#FFF',
          fontWeight: 600,
          marginLeft: 4
        }}
        onClick={() => withdraw()}
      >
        {$t('WITHDRAW')}
      </DefaultButton>
    </div>
  )
}
