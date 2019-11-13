import React from 'react'
import styled from 'styled-components'
import arrowIcon from '../../static/arrow.svg'

const ExecuteMessageItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 14px;
  margin-left: 16px;
  font-size: 12px;
  padding: 12px;
  height: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  background: #f2f3f4;
  .name {
    font-size: 14px;
    font-weight: 500;
  }
  .params {
    color: #0088cc;
  }
  .return-type {
    color: #2caa84;
  }
  &.can-execute {
    cursor: pointer;
  }
  &.send-method {
    background: #3f3f3f;
    color: #fff;
    .params {
      color: #46aee2;
    }
    .return-type {
      color: #34c69a;
    }
  }
  img {
    margin-left: 8px;
  }
`

export default function({ item, click, execute = false }) {
  return (
    <ExecuteMessageItem
      className={
        (item.mutates ? 'send-method' : '') + (execute ? ' can-execute' : '')
      }
      onClick={() => {
        if (execute) {
          click(item)
        }
      }}
    >
      <div>
        <span className="name">{item.name}(</span>
        {item.args.map(({ name, type }, i) => (
          <span key={i}>
            <span className="params">{name}: </span>
            {i !== item.args.length - 1 ? (
              <span className="return-type">{type.displayName}, </span>
            ) : (
              <span className="return-type">{type.displayName}</span>
            )}
          </span>
        ))}
        <span className="name">)</span>
        {item.returnType ? (
          <>
            <span>: </span>
            <span className="return-type">{item.returnType.displayName}</span>
          </>
        ) : null}
      </div>
      {execute && <img src={arrowIcon} alt="arrow" />}
    </ExecuteMessageItem>
  )
}
