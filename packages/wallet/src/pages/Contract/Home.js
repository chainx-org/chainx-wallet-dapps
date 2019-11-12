import React, { useState, useEffect } from 'react'
import { PrimaryButton, DefaultButton } from '@chainx/ui'
import DeployContract from '../../components/Contract/DeployContract'
import ContractCard from '../../components/Contract/ContractCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import './Home.scss'

function Home(props) {
  const { abiList, contractList } = useSelector(state => state.local)
  const [update, setUpdate] = useState(new Date())
  const [showDeploy, setShowDeploy] = useState(false)
  const [isnew, setIsnew] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAbiAndContractList())
  }, [update, dispatch])

  const clickDeploy = type => {
    setIsnew(type)
    setShowDeploy(true)
  }

  return (
    <div className="home">
      {showDeploy && (
        <DeployContract
          props={props}
          abi={abiList[0]}
          setShowDeploy={setShowDeploy}
          isnew={isnew}
          setUpdate={setUpdate}
        />
      )}
      <div className="button-area">
        {abiList.length > 0 && (
          <PrimaryButton
            className="wide-button"
            onClick={() => clickDeploy(true)}
          >
            Deploy a code hash
          </PrimaryButton>
        )}
        <DefaultButton
          className="wide-button"
          onClick={() => clickDeploy(false)}
        >
          Add existing contract
        </DefaultButton>
      </div>
      {contractList.length > 0 ? (
        contractList.map((item, i) => (
          <ContractCard
            item={item}
            key={i}
            type="CONTRACT"
            setUpdate={setUpdate}
          />
        ))
      ) : (
        <div className="no-data">
          <span>No contract code available</span>
        </div>
      )}
    </div>
  )
}

export default Home
