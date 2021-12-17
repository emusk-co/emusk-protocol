const { ethers } = require("hardhat");
const DeployAndDepositEmusk = require("../helpers/emusk");
const DeployAndMintERC1155EMUSK = require("../helpers/emusknft1155");
const exchangeOrderType = require('../helpers/typed-struct/order.json')

async function main() {
    const [owner, signer] = await ethers.getSigners();

    //deploy TransferProxy
    const TransferProxy = await ethers.getContractFactory("TransferProxy")
    const transferProxy = await TransferProxy.deploy()
    await transferProxy.deployed();
    console.log("transferProxy", transferProxy.address);

    const TransferProxyForDeprecated = await ethers.getContractFactory("src/marketplace/transferproxy/TransferProxyForDeprecated.sol:TransferProxyForDeprecated")
    const transferProxyForDeprecated = await TransferProxyForDeprecated.deploy()
    await transferProxyForDeprecated.deployed();
    console.log("transferProxyForDeprecated", transferProxyForDeprecated.address)

    const ERC20TransferProxy = await ethers.getContractFactory("src/marketplace/transferproxy/ERC20TransferProxy.sol:ERC20TransferProxy")
    const erc20TransferProxy = await ERC20TransferProxy.deploy()
    await erc20TransferProxy.deployed();
    console.log("erc20TransferProxy", erc20TransferProxy.address)

    const ExchangeStateV1 = await ethers.getContractFactory("src/marketplace/ExchangeStateV1.sol:ExchangeStateV1")
    const exchangeStateV1 = await ExchangeStateV1.deploy()
    await exchangeStateV1.deployed();
    console.log("exchangeStateV1", exchangeStateV1.address)

    const ExchangeOrdersHolderV1 = await ethers.getContractFactory("src/marketplace/ExchangeOrdersHolderV1.sol:ExchangeOrdersHolderV1")
    const exchangeOrdersHolderV1 = await ExchangeOrdersHolderV1.deploy()
    await exchangeOrdersHolderV1.deployed();
    console.log("exchangeOrdersHolderV1", exchangeOrdersHolderV1.address)

    const ExchangeV1 = await ethers.getContractFactory("ExchangeV1")
    const beneficiaryAddress = '0x043C8Aed01Ff688FcA5912756A914446B18CA199';  // beneficiary address
    // TransferProxy _transferProxy, TransferProxyForDeprecated _transferProxyForDeprecated, ERC20TransferProxy _erc20TransferProxy, ExchangeStateV1 _state,
    //     ExchangeOrdersHolderV1 _ordersHolder, address payable _beneficiary, address _buyerFeeSigner
    const exchangeV1 = await ExchangeV1.deploy(transferProxy.address, transferProxyForDeprecated.address, erc20TransferProxy.address, exchangeStateV1.address,
        exchangeOrdersHolderV1.address, beneficiaryAddress, signer.address)
    await exchangeV1.deployed();
    console.log("exchangeV1", exchangeV1.address)

    await transferProxy.addOperator(exchangeV1.address)  // Add operator to TransferProxy
    await exchangeStateV1.addOperator(exchangeV1.address) // Add operator to exchange state
    await erc20TransferProxy.addOperator(exchangeV1.address) // Add operator to exchange state

    const selling = ethers.utils.parseEther("0.5")
    const buying = ethers.BigNumber.from(1)
    const sellerFee = ethers.BigNumber.from(1000) // 10%
    const buyerFee = ethers.BigNumber.from(1000) // 10%
    const amount = ethers.utils.parseEther("0.5")


    // Fee For ERC20 sellers
    const buyerFeeValue = amount.mul(buyerFee).div(10000)
    const sellerFeeValue = amount.sub(amount.mul(sellerFee).div(10000))
    const requiredERC20 = amount.add(buyerFeeValue.add(sellerFeeValue))



    const {erc1155Emusk, minter: buyer} = await DeployAndMintERC1155EMUSK()
    await erc1155Emusk.connect(buyer).setApprovalForAll(transferProxy.address, true)

    const {deployedEMUSK, buyer: seller} = await DeployAndDepositEmusk()
    await (await deployedEMUSK.connect(seller).approve(erc20TransferProxy.address, requiredERC20)).wait()

    // await (await wBNB.deposit({value: msgValue}))
    console.log("Balance EMUSK Of Seller ", ethers.utils.formatEther(await deployedEMUSK.balanceOf(seller.address)))
    console.log("Balance EMUSk Of Buyer ", ethers.utils.formatEther(await deployedEMUSK.balanceOf(buyer.address)))

    const order = [
        [
            seller.address, // owner
            moment().unix(), // salt : random number
            [ // Buy Asset
                deployedEMUSK.address,
                0,
                1 // enum AssetType ERC20
            ],
            [ // Sell Asset
                deployedEMUSK.address,
                tokenID,
                2 // enum AssetType ERC1155
            ]
        ],
        selling, // selling    count of selling asset
        buying, // buying      price of total receive
        sellerFee     // sellerFee
    ]

    const toSignForOrder = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            [
                exchangeOrderType
            ],
            [
                order
            ])
    ).slice(2)

    const signedMessageForSell = await seller.signMessage(toSignForOrder)
    const sellSig = splitSignature(signedMessageForSell)

    const toSignForOrderBuy = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            [
                exchangeOrderType,
                'uint256' // buyerfee
            ],
            [
                order,
                buyerFee
            ])
    ).slice(2)

    const signedMessageForBuy = await signer.signMessage(toSignForOrderBuy)
    const buySig = splitSignature(signedMessageForBuy)

    console.log("Balance Of Seller ", await erc1155Emusk.balanceOf(seller.address, tokenID))
    console.log("Balance Of Buyer ", await erc1155Emusk.balanceOf(buyer.address, tokenID))

    const buytx = await exchangeV1.connect(buyer).exchange(
        order,
        [sellSig.v, sellSig.r, sellSig.s],
        buyerFee, // buyerFee
        [buySig.v, buySig.r, buySig.s],
        amount, // amount
        buyer.address
        // {value: msgValue}
    )

    const buyTransactionResult = await buytx.wait()
    console.log(buyTransactionResult.logs)

    // console.log("Balance Of Seller ", await nftObr.balanceOf(seller.address, tokenID))
    // console.log("Balance Of Buyer ", await nftObr.balanceOf(buyer.address, tokenID))
    // console.log("Balance WBNB Of Seller ", ethers.utils.formatEther(await wBNB.balanceOf(seller.address)))
    // console.log("Balance WBNB Of Buyer ", ethers.utils.formatEther(await wBNB.balanceOf(buyer.address)))


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });