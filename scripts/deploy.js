// This is a script for deploying your contracts. You can adapt it to deploy

const { ethers } = require("hardhat");
// yours, or create new ones.
async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }
    // ethers is avaialble in the global scope
    const [owner, signer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await owner.getAddress()
    );
    console.log("Account balance:", (await owner.getBalance()).toString());
    
    //deploy TransferProxy
    const TransferProxy = await ethers.getContractFactory("TransferProxy")
    const transferProxy = await TransferProxy.deploy()
    await transferProxy.deployed();
    console.log("transferProxy", transferProxy.address);
    
    // Only for ERC721 not used for NFT OBR
    const TransferProxyForDeprecated = await ethers.getContractFactory("TransferProxyForDeprecated")
    const transferProxyForDeprecated = await TransferProxyForDeprecated.deploy()
    await transferProxyForDeprecated.deployed();
    console.log("transferProxyForDeprecated", transferProxyForDeprecated.address);

    const ERC20TransferProxy = await ethers.getContractFactory("ERC20TransferProxy")
    const erc20TransferProxy = await ERC20TransferProxy.deploy()
    await erc20TransferProxy.deployed();
    console.log("erc20TransferProxy", erc20TransferProxy.address);

    const ExchangeStateV1 = await ethers.getContractFactory("ExchangeStateV1")
    const exchangeStateV1 = await ExchangeStateV1.deploy()
    await exchangeStateV1.deployed();
    console.log("exchangeStateV1", exchangeStateV1.address);

    const ExchangeOrdersHolderV1 = await ethers.getContractFactory("ExchangeOrdersHolderV1")
    const exchangeOrdersHolderV1 = await ExchangeOrdersHolderV1.deploy()
    await exchangeOrdersHolderV1.deployed();
    console.log("exchangeOrdersHolderV1", exchangeOrdersHolderV1.address);

    const ExchangeV1 = await ethers.getContractFactory("ExchangeV1")
    const exchangeV1 = await ExchangeV1.deploy(transferProxy.address, transferProxyForDeprecated.address, erc20TransferProxy.address, exchangeStateV1.address,
        exchangeOrdersHolderV1.address, owner.address, signer.address)
    await exchangeV1.deployed();
    console.log("exchangeV1", exchangeV1.address);

    // add operator
    await transferProxy.addOperator(exchangeV1.address)  // Add operator to TransferProxy
    await exchangeStateV1.addOperator(exchangeV1.address) // Add operator to exchange state
    await erc20TransferProxy.addOperator(exchangeV1.address) // Add operator to exchange state

    // deploy ERC1155
    const ERC1155EMUSK = await ethers.getContractFactory("ERC1155EMUSK");
    const erc1155Emusk = await ERC1155EMUSK.deploy("ERC1155EMUSK", "EMUSK", signer.address, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/");
    await erc1155Emusk.deployed();
    console.log('ERC1155EMUSK Address', erc1155Emusk.address)

    //deploy ERC721
    const ERC721EMUSK = await ethers.getContractFactory("ERC721EMUSK");
    const erc721Emusk = await ERC721EMUSK.deploy("ERC721EMUSK", "EMUSK", signer.address, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/");
    await erc721Emusk.deployed();
    console.log('ERC721EMUSK Address', erc721Emusk.address)

}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });