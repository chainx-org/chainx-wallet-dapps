import React, { Component } from 'react'
import styled from 'styled-components'

const Outter = styled.span`
  opacity: 0.72;
  color: #000000;
`

const Inner = styled.span`
  opacity: 0.32;
`

function zeroSmoke(value) {
  if (value > 0) {
    const str = value.toString()
    const Reg = new RegExp(/0{3,}$/)
    if (Reg.test(str)) {
      return (
        <>
          {str.replace(Reg, '')}
          <Inner>{str.match(Reg)[0]}</Inner>
        </>
      )
    } else {
      return value
    }
  }
  return <Inner>{value}</Inner>
}

function numberToAmount(number, precision) {
  const options = {}
  options.minimumFractionDigits = precision
  options.maximumFractionDigits = precision
  options.useGrouping = false

  const value = new Intl.NumberFormat(undefined, options).format(
    number / Math.pow(10, precision)
  )

  return <>{zeroSmoke(value)}</>
}

export default class Amount extends Component {
  render() {
    const { value, precision } = this.props
    return <Outter>{numberToAmount(value, precision)}</Outter>
  }
}
