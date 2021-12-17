const hre = require("hardhat");
const {ethers} = hre

async function DeployAndDepositEmusk() {
    const [owner, signer, minter, buyer] = await ethers.getSigners();
    const EMUSK = await ethers.getContractFactory("Emusk");
    const deployedEMUSK = await EMUSK.deploy();
    await deployedEMUSK.deployed();

    console.log('Emusk', deployedEMUSK.address);

    // (await buyer.sendTransaction({value: ethers.utils.parseEther('1'), to: wBNB.address})).wait()
    (await deployedEMUSK.connect(buyer).deposit({value: ethers.utils.parseEther('1')})).wait()

    return {deployedEMUSK, buyer}
}

module.exports = DeployAndDepositEmusk
