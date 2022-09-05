import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const tag = "ConduitControllerUpdateChannel"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, save, read, getOrNull, log } = deployments
  const { deployer } = await getNamedAccounts()

  
  const task = await getOrNull(tag)
  if (task) {
    log(`skip ${tag} at ${task.address}`)
    return
  }

  const conduitKey = `${deployer}000000000000000000000000`
  const { conduit } = (await read('ConduitController', 'getConduit', conduitKey))

  await execute(
    'ConduitController',
    { from: deployer, log: true },
    'updateChannel',
    conduit,
    (await get('Seaport')).address,
    true
  )
  
  await save(tag, {
    abi: (await get("ConduitController")).abi,
    address: conduit
  })
}

export default func
func.tags = [tag]
func.dependencies = ['ConduitController','Seaport']