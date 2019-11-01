import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeSnackInSeconds, snacksSelector } from './reducers/snackSlice'
import {
  SuccessSnackbar,
  DangerSnackbar,
  InfoSnackbar,
  WarningSnackbar
} from '@chainx/ui'

export default function() {
  const dispatch = useDispatch()
  const snacks = useSelector(snacksSelector)

  return (
    <React.Fragment>
      {snacks.map((snack, index) => {
        let Component = InfoSnackbar
        if (snack.type === 'success') {
          Component = SuccessSnackbar
        } else if (snack.type === 'warning') {
          Component = WarningSnackbar
        } else if (snack.type === 'error') {
          Component = DangerSnackbar
        }

        const message = (
          <p style={{ margin: 0, wordBreak: 'break-all' }}>{snack.message}</p>
        )

        return (
          <Component
            key={index}
            open={true}
            handleClose={() => {
              removeSnackInSeconds(dispatch, snack.id)
            }}
            title={snack.title}
            message={message}
          />
        )
      })}
    </React.Fragment>
  )
}
