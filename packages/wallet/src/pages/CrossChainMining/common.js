export function calcPseduIntentionInterest(blockNumber, intention, record) {
  if (!record || !intention) {
    return 0
  }

  // 用户最新总票龄  = （链最新高度 - 用户总票龄更新高度）*用户投票金额 +用户总票龄
  const myWeight =
    (blockNumber - record.lastTotalDepositWeightUpdate) * record.balance +
    Number(record.lastTotalDepositWeight)

  // 节点最新总票龄  = （链最新高度 - 节点总票龄更新高度）*节点得票总额 +节点总票龄
  const nodeVoteWeight =
    (blockNumber - intention.lastTotalDepositWeightUpdate) *
      intention.circulation +
    Number(intention.lastTotalDepositWeight)

  // 待领利息 = 用户最新总票龄 / 节点最新总票龄 * 节点奖池金额

  // TODO: record.lastTotalDepositWeightUpdate <= 0的条件属于补救措施，后边应改掉
  const interest =
    nodeVoteWeight <= 0 || record.lastTotalDepositWeightUpdate <= 0
      ? 0
      : (myWeight / nodeVoteWeight) * intention.jackpot * 0.9

  return parseInt(interest)
}

export function getClaimInfo(head, pcx, record, interest) {
  if (!head || !pcx || !record || !interest) {
    return
  }

  const { number: blockNumber } = head

  const hasEnoughStaking = pcx.reservedStaking > (interest * 100) / 9
  const reachClaimHeight = blockNumber > record.nextClaim
  const canClaim = interest > 0 && hasEnoughStaking && reachClaimHeight
  let needStakingPcx = 0
  if (!hasEnoughStaking) {
    needStakingPcx = (interest * 100) / 9 - pcx.reservedStaking
  }
  return {
    canClaim,
    hasEnoughStaking,
    reachClaimHeight,
    nextClaim: record.nextClaim,
    needStakingPcx
  }
}

export function calcIntentionInterest(record, intentions = [], blockNumber) {
  const intention = intentions.find(
    intention => intention.account === record.intention
  )
  if (!intention) {
    return 0
  }

  // // 用户最新总票龄  = （链最新高度 - 用户总票龄更新高度）*用户投票金额 +用户总票龄
  const myWeight =
    (blockNumber - record.info.lastVoteWeightUpdate) * record.info.nomination +
    Number(record.info.lastVoteWeight)
  // 节点最新总票龄  = （链最新高度 - 节点总票龄更新高度）*节点得票总额 +节点总票龄
  const nodeVoteWeight =
    (blockNumber - intention.lastTotalVoteWeightUpdate) *
      intention.totalNomination +
    Number(intention.lastTotalVoteWeight)

  // 待领利息 = 用户最新总票龄 / 节点最新总票龄 * 节点奖池金额
  return (myWeight / nodeVoteWeight) * intention.jackpot
}
