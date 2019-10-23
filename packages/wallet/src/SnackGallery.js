import React from 'react'
import { useSelector } from 'react-redux'
import { snacksSelector } from './reducers/snackSlice'
import {
  SuccessSnackbar,
  DangerSnackbar,
  InfoSnackbar,
  WarningSnackbar
} from '@chainx/ui'

export default function() {
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

        return (
          <Component
            key={index}
            open={true}
            handleClose={() => {}}
            title={snack.title}
            message={snack.message}
          />
        )
      })}
    </React.Fragment>
  )
}
