const hre = require("hardhat");
const {ethers} = hre
const DeployAndMintERC1155EMUSK = require("../helpers/emusknft1155");
const DeployAndDepositEmusk = require("../helpers/emusk");
const {splitSignature} = require("@ethersproject/bytes");
const exchangeOrderType = require('../helpers/typed-struct/order.json')

const moment = require('moment')

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const tokenID = 1
const uri = '/ipfs/testhash'
const supply = 100

async function main() {
    const [owner, signer] = await ethers.getSigners();

    const ProxyFactory = await ethers.getContractFactory("ProxyFactory")
    const proxyFactory = await ProxyFactory.deploy()
    await proxyFactory.deployed();
    console.log("proxyFactory", proxyFactory.address)

    const GnosisSafe = await ethers.getContractFactory("GnosisSafe")
    const gnosisSafe = await GnosisSafe.deploy()
    await gnosisSafe.deployed();
    console.log("gnosisSafe", gnosisSafe.address)

    const DefaultCallbackHandler = await ethers.getContractFactory("DefaultCallbackHandler")
    const defaultCallbackHandler = await DefaultCallbackHandler.deploy()
    await defaultCallbackHandler.deployed();
    console.log("defaultCallbackHandler", defaultCallbackHandler.address)

    // Encoding with utils human readable

    // const sighash = ethers.utils.id("setup(address[],uint256,address,bytes,address,address,uint256,address)").slice(2,10)
    // const setupargs = ethers.utils.defaultAbiCoder.encode(["address[]", "uint256", "address", "bytes", "address", "address", "uint256", "address"],
    //     [
    //         [owner.address, signer.address], // _owners
    //         2, // _threshold
    //         ZERO_ADDRESS, // to
    //         "0x", // data
    //         defaultCallbackHandler.address, // fallbackhandler
    //         ZERO_ADDRESS, // paymentToken
    //         0, // payment
    //         ZERO_ADDRESS // paymentReceiver
    //     ]).slice(2)
    // const setupInitCode = '0x' + sighash + setupargs

    // console.log(ethers.utils.defaultAbiCoder.decode(["address[]", "uint256", "address", "bytes", "address", "address", "uint256", "address"], setupInitCode))
    // proxyFactory.once("ProxyCreation", (proxy) => {
    //     console.log("ProxyCreation with Proxy address ", proxy)
    // })


    // Encoding with abi Interface

    // const gnosisAbi = require('../abi/contracts/GnosisSafe.sol/GnosisSafe.json')
    // const gnosisInterface = new ethers.utils.Interface(gnosisAbi);
    // const setupInitCode = gnosisInterface.encodeFunctionData('setup', [[owner.address, signer.address], // _owners
    //     2, // _threshold
    //     ZERO_ADDRESS, // to
    //     "0x", // data
    //     defaultCallbackHandler.address, // fallbackhandler
    //     ZERO_ADDRESS, // paymentToken
    //     0, // payment
    //     ZERO_ADDRESS])

    // let tx = await proxyFactory.createProxyWithNonce(gnosisSafe.address, setupInitCode, 1610036325451)
    // let txReceipt = await tx.wait()
    // const beneficiaryAddress = '0x' + txReceipt.logs[0].data.slice(66 - 40);  // beneficiary address
    // console.log(await ethers.provider.getTransactionReceipt(tx.hash))

    const TransferProxy = await ethers.getContractFactory("src/marketplace/transferproxy/TransferProxy.sol:TransferProxy")
    const transferProxy = await TransferProxy.deploy()
    await transferProxy.deployed();
    console.log("transferProxy", transferProxy.address)

    // Only for ERC721 not used for ERC1155EMUSK
    const TransferProxyForDeprecated = await ethers.getContractFactory("contracts/TransferProxyForDeprecated.sol:TransferProxyForDeprecated")
    const transferProxyForDeprecated = await TransferProxyForDeprecated.deploy()
    await transferProxyForDeprecated.deployed();
    console.log("transferProxyForDeprecated", transferProxyForDeprecated.address)

    const ERC20TransferProxy = await ethers.getContractFactory("contracts/ERC20TransferProxy.sol:ERC20TransferProxy")
    const erc20TransferProxy = await ERC20TransferProxy.deploy()
    await erc20TransferProxy.deployed();
    console.log("erc20TransferProxy", erc20TransferProxy.address)

    const ExchangeStateV1 = await ethers.getContractFactory("contracts/ExchangeStateV1.sol:ExchangeStateV1")
    const exchangeStateV1 = await ExchangeStateV1.deploy()
    await exchangeStateV1.deployed();
    console.log("exchangeStateV1", exchangeStateV1.address)

    const ExchangeOrdersHolderV1 = await ethers.getContractFactory("contracts/ExchangeOrdersHolderV1.sol:ExchangeOrdersHolderV1")
    const exchangeOrdersHolderV1 = await ExchangeOrdersHolderV1.deploy()
    await exchangeOrdersHolderV1.deployed();
    console.log("exchangeOrdersHolderV1", exchangeOrdersHolderV1.address)

    const ExchangeV1 = await ethers.getContractFactory("ExchangeV1")
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

    // Fee For NFT sellers

    // const paying = buying.mul(amount).div(selling)
    // const buyerFeeValue = paying.mul(buyerFee).div(10000)
    // const msgValue = paying.add(buyerFeeValue)


    // Fee For ERC20 sellers
    const buyerFeeValue = amount.mul(buyerFee).div(10000)
    const sellerFeeValue = amount.sub(amount.mul(sellerFee).div(10000))
    const requiredERC20 = amount.add(buyerFeeValue.add(sellerFeeValue))



    const {nftObr, minter: buyer} = await DeployAndMintNftObr()
    await nftObr.connect(buyer).setApprovalForAll(transferProxy.address, true)

    const {wBNB, buyer: seller} = await DeployAndDepositWbnb()
    await (await wBNB.connect(seller).approve(erc20TransferProxy.address, requiredERC20)).wait()

    // await (await wBNB.deposit({value: msgValue}))
    console.log("Balance WBNB Of Seller ", ethers.utils.formatEther(await wBNB.balanceOf(seller.address)))
    console.log("Balance WBNB Of Buyer ", ethers.utils.formatEther(await wBNB.balanceOf(buyer.address)))

    const order = [
        [
            seller.address, // owner
            moment().unix(), // salt : random number
            [ // Buy Asset
                wBNB.address,
                0,
                1 // enum AssetType ERC20
            ],
            [ // Sell Asset
                nftObr.address,
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

    console.log("Balance Of Seller ", await nftObr.balanceOf(seller.address, tokenID))
    console.log("Balance Of Buyer ", await nftObr.balanceOf(buyer.address, tokenID))

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
    // console.log(buyTransactionResult.logs)

    console.log("Balance Of Seller ", await nftObr.balanceOf(seller.address, tokenID))
    console.log("Balance Of Buyer ", await nftObr.balanceOf(buyer.address, tokenID))
    console.log("Balance WBNB Of Seller ", ethers.utils.formatEther(await wBNB.balanceOf(seller.address)))
    console.log("Balance WBNB Of Buyer ", ethers.utils.formatEther(await wBNB.balanceOf(buyer.address)))



}

main()
    .then(() => {
            console.log("Finished!")
            process.exit(0)
        }
    )
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
