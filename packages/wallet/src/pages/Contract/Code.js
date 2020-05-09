import React, { useEffect, useState } from 'react'
import { DefaultButton, PrimaryButton } from '@chainx/ui'
import DeployContract from '../../components/Contract/DeployContractDialog'
import ContractCard from '../../components/Contract/ContractCard'
import ContractHeader from '../../components/Contract/ContractHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import AddFromCodeHashDialog from '../../components/Contract/AddFromCodeHashDialog'
import UploadContractDialog from '../../components/Contract/UploadContractDialog'

function Code(props) {
  const [showUpload, setShowUpload] = useState(false)
  const [showDeploy, setShowDeploy] = useState(false)
  const [abi, setAbi] = useState({ abi: { messages: [] } })
  const [update, setUpdate] = useState(new Date())
  const [showAddFromHash, setShowAddFromHash] = useState(false)
  const [loading, setLoading] = useState(false)

  const { abiList } = useSelector(state => state.local)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAbiAndContractList())
  }, [update, dispatch])

  const clickUpload = () => {
    setShowUpload(true)
    setShowAddFromHash(false)
  }

  const clickAddFromCodeHash = () => {
    setShowUpload(false)
    setShowAddFromHash(true)
  }

  return (
    <div className="contract-code">
      <ContractHeader />
      {showDeploy && (
        <DeployContract
          props={props}
          abi={abi}
          setShowDeploy={setShowDeploy}
          setUpdate={setUpdate}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {showUpload && (
        <UploadContractDialog handleClose={() => setShowUpload(false)} />
      )}
      {showAddFromHash && (
        <AddFromCodeHashDialog handleClose={() => setShowAddFromHash(false)} />
      )}
      <div className="button-area">
        <PrimaryButton className="contract-wide-button" onClick={clickUpload}>
          Upload WASM
        </PrimaryButton>
        <DefaultButton
          className="contract-wide-button last-button"
          onClick={clickAddFromCodeHash}
        >
          Add existing code hash
        </DefaultButton>
      </div>
      {abiList.length > 0 ? (
        <div className="contract-list">
          {abiList.map((item, i) => (
            <ContractCard
              key={i}
              item={item}
              setAbi={setAbi}
              setShowDeploy={setShowDeploy}
              setUpdate={setUpdate}
              type="ABI"
            />
          ))}
        </div>
      ) : (
        <div className="no-data">
          <span>No contract code available</span>
        </div>
      )}
    </div>
  )
}

export default Code
