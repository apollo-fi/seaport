import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, save, read, getOrNull, log } = deployments
  const { deployer } = await getNamedAccounts()

  const tag = "ConduitControllerCreateConduit"
  const task = await getOrNull(tag)
  if (task) {
    log(`skip ${tag} at ${task.address}`)
    return
  }

  const conduitKey = `${deployer}000000000000000000000000`

  await execute(
    'ConduitController',
    { from: deployer, log: true },
    'createConduit',
    conduitKey,
    deployer
  )

  const { conduit } = (await read('ConduitController', 'getConduit', conduitKey))

  await save(tag, {
    abi: (await get("ConduitController")).abi,
    address: conduit
  })
}

export default func
func.tags = ["ConduitControllerCreateConduit"]
func.dependencies = ['ConduitController']