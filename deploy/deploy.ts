import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, ethers} = hre;
  const {deploy} = deployments;
  const signer = "0x80aEa81791Ded20568221346C79B0ad4E0890FAA";
  const {deployer} = await getNamedAccounts();
  // const TransferProxy = await deploy('TransferProxy', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });
  // const TransferProxyForDeprecated = await deploy('TransferProxyForDeprecated', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });
  // const ERC20TransferProxy = await deploy('ERC20TransferProxy', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });
  // const ExchangeStateV1 = await deploy('ExchangeStateV1', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });
  // const ExchangeOrdersHolderV1 = await deploy('ExchangeOrdersHolderV1', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });
  // const ExchangeV1 = await deploy('ExchangeV1', {
  //   from: deployer,
  //   args: [TransferProxy.address, TransferProxyForDeprecated.address, ERC20TransferProxy.address, ExchangeStateV1.address, ExchangeOrdersHolderV1.address, deployer, signer],
  //   log: true,
  // });
  // const transferProxy = await ethers.getContractAt("TransferProxy", TransferProxy.address);
  // const transferProxyForDeprecated = await ethers.getContractAt("TransferProxyForDeprecated", TransferProxyForDeprecated.address);
  // const exchangeStateV1 = await ethers.getContractAt("ExchangeStateV1", ExchangeStateV1.address);
  // const erc20transferProxy = await ethers.getContractAt("ERC20TransferProxy", ERC20TransferProxy.address);
  // // add operator
  // await transferProxy.addOperator(ExchangeV1.address)  // Add operator to TransferProxy
  // await transferProxyForDeprecated.addOperator(ExchangeV1.address)  // Add operator to TransferProxyForDeprecated
  // await exchangeStateV1.addOperator(ExchangeV1.address) // Add operator to exchange state
  // await erc20transferProxy.addOperator(ExchangeV1.address) // Add operator to exchange state

  // const ERC721EMUSK = await deploy('ERC721EMUSK', {
  //   from: deployer,
  //   args: ["ERC721EMUSK", "EMUSK", signer, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/"],
  //   log: true,
  // });

  // const ERC1155EMUSK = await deploy('ERC1155EMUSK', {
  //   from: deployer,
  //   args: ["ERC1155EMUSK", "EMUSK", signer, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/"],
  //   log: true,
  // });

  // const Emusk = await deploy('Emusk', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  // const NFTSender = await deploy('NFTMultiSender', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  // const GeniusNFT = await deploy('GeniusNFT', {
  //   from: deployer,
  //   args: ["Genius NFT", "GNFT", signer, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/"],
  //   log: true,
  // });
  
  // const contractAddress = GeniusNFT.address;
  // await hre.run('verify:verify', {
  //   address: contractAddress,
  //   contract: "src/GeniusNFT.sol:GeniusNFT",
  //   constructorArguments: [
  //     "Genius NFT", "GNFT", signer, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/"
  //   ]
  // });
  
    // const depositToken = await deploy('MockERC20', {from:deployer, args:[], log: true});
    // while(!depositToken.address)
    // {
    //   await delay(300);
    //   console.log("---waiting deploying token");
    // }
    const depositTokenAddress = "0x0199Bfa055eb910f9D630D25C84381976486c99D";
    // const TokenPresale = await deploy('TokenPresale', {  from: deployer,  args: [100000000000, depositTokenAddress], log: true,  });
    // while(!TokenPresale.address)
    // {
    //   await delay(300);
    //   console.log("---waiting deploying presale contract");
    // }
    const contractAddress = "0x45F9a836c9Ae0a63DC460195c12740E219819ca3";
    await hre.run('verify:verify', {
      address: contractAddress,
      contract: "src/TokenPresale.sol:TokenPresale",
      constructorArguments: [100000000000, depositTokenAddress]
    });

};

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export default func;
func.tags = ['all'];
