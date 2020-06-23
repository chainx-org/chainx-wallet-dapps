import React from 'react'
import styled from 'styled-components'
import Mac from './mac.svg'
import Win from './win.svg'
import Linux from './linux.svg'

const Download = styled.ol`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;

  display: flex;
  justify-content: space-between;
`

const Item = styled.li`
  cursor: pointer;
  list-style: none;
  margin: 0;
  padding: 20px 0;
  width: 105px;
  height: 100px;

  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img.mac {
    position: relative;
    top: -6px;
  }

  span {
    text-align: center;
    opacity: 0.72;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.1px;
    line-height: 16px;
    padding: 0 25px;
  }
`

export default function() {
  const macUrl =
    'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/1.1.0/ChainX-Signer-1.1.0.dmg'
  const win64Url =
    'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/1.1.0/ChainX-Signer-Setup-1.1.0.exe'
  const win32Url =
    'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/1.0.9/ChainX-Signer-1.0.9-ia32-win.zip'
  const linuxUrl =
    'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/1.1.0/ChainX-Signer-1.1.0.AppImage'

  return (
    <Download>
      <Item onClick={() => window.open(macUrl)}>
        <img className="mac" src={Mac} alt="mac" width={28} />
        <span>macOS</span>
      </Item>
      <Item onClick={() => window.open(win64Url)}>
        <img src={Win} alt="windows" />
        <span>Windows 64bit</span>
      </Item>
      <Item onClick={() => window.open(win32Url)}>
        <img src={Win} alt="windows" />
        <span>Windows 32bit</span>
      </Item>
      <Item onClick={() => window.open(linuxUrl)}>
        <img src={Linux} alt="linux" />
        <span>Linux</span>
      </Item>
    </Download>
  )
}
