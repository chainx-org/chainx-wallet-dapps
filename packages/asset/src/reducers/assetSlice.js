import { createSlice } from 'redux-starter-kit'
import chainx from '../services/chainx'
import { camelCaseKey } from './util'

const assetSlice = createSlice({
  slice: 'asset',
  initialState: {
    assetsInfo: [],
    assets: []
  },
  reducers: {
    setInfo: {
      reducer(state, action) {
        state.assetsInfo = action.payload
      }
    },
    setAssets: {
      reducer(state, action) {
        state.assets = action.payload
      }
    }
  }
})

export const fetchAccountAssets = address => async dispatch => {
  await chainx.isRpcReady()
  const { asset } = chainx

  const resp = await asset.getAssetsByAccount(address, 0, 100)
  const assets = resp.data.map(item => {
    return { name: item.name, details: camelCaseKey(item.details) }
  })

  dispatch(setAssets(assets))
}

export const fetchAssetsInfo = () => async dispatch => {
  await chainx.isRpcReady()
  const { asset } = chainx

  const resp = await asset.getAssets(0, 100)
  const assetsInfo = resp.data.map(item => {
    const details = camelCaseKey(item.details)
    const limitProps = camelCaseKey(item.limitProps)

    return { ...item, details, limitProps }
  })

  dispatch(setInfo(assetsInfo))
}

export const { setInfo, setAssets } = assetSlice.actions

export default assetSlice.reducer
