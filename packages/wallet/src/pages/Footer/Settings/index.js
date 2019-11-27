import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLocale } from '../../../reducers/settingsSlice'
import arrowIcon from './arrow.svg'
import languageIcon from './language.svg'
import Wrapper from './Wrapper'
import useOutsideClick from '../../../utils/useClickOutside'

export default function() {
  const [localeSettingOpen, setLocaleSettingOpen] = useState(false)
  const dispatch = useDispatch()

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    setLocaleSettingOpen(false)
  })

  const configLocale = (locale = 'zh') => {
    dispatch(setLocale(locale))
    setLocaleSettingOpen(false)
  }

  return (
    <Wrapper>
      <div ref={popup}>
        <div
          className="locale"
          onClick={() => {
            console.log('fuck')
            setLocaleSettingOpen(true)
          }}
        >
          <img className="language" src={languageIcon} alt="language" />
          <span>Language</span>
          <img className="arrow" src={arrowIcon} alt="open" />
        </div>
        {localeSettingOpen ? (
          <ul className="locale-setting">
            <li onClick={() => configLocale('zh')}>中文(简体)</li>
            <li onClick={() => configLocale('en')}>English</li>
          </ul>
        ) : null}
      </div>
    </Wrapper>
  )
}
