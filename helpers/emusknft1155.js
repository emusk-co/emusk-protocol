const hre = require("hardhat");
const {ethers} = hre

const moment = require('moment')
// const exchangeOrderType = require('../typed-struct/order.json')
const {splitSignature} = require("@ethersproject/bytes");
const tokenID = 1
const uri = '/ipfs/testhash'
const supply = 10

function sign(address, data) {
    return hre.network.provider.send(
      "eth_sign",
      [address, ethers.utils.hexlify(ethers.utils.toUtf8Bytes('foo'))]
    )
  }

async function DeployAndMintERC1155EMUSK() {
    const [owner, signer, minter] = await ethers.getSigners();

    const ERC1155EMUSK = await ethers.getContractFactory("ERC1155EMUSK");
    const erc1155Emusk = await ERC1155EMUSK.deploy("ERC1155EMUSK", "EMUSK", signer.address, "https://api.emusk.com/contractMetadata/{address}", "https://ipfs.io/");

    await erc1155Emusk.deployed();
    console.log('ERC1155EMUSK Address', erc1155Emusk.address)
    const toSignForMint = ethers.utils.solidityKeccak256(["address", "uint256"], [erc1155Emusk.address, tokenID]);
    // const toSignForMint = await erc1155Emusk.encodePackedData(tokenID);
    // const {r, s, v} = splitSignature(await signer.signMessage(ethers.utils.arrayify(await nftObr.encodePackedData(tokenID))))
    const {r, s, v} = splitSignature(await signer.signMessage(ethers.utils.arrayify(toSignForMint)))
    await erc1155Emusk.connect(minter).mint(tokenID, v, r, s, [[minter.address, 1000]], supply, uri)
    return {erc1155Emusk, owner, signer, minter}
}

module.exports = DeployAndMintERC1155EMUSK

