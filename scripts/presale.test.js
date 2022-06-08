const {ethers} = require('hardhat');

async function main() {
    const MockERC20 = await ethers.getContractFactory('MockERC20');
    const deployedERC20 = await MockERC20.deploy();
    await deployedERC20.deployed();
    const TokenPresale = await ethers.getContractFactory('TokenPresale');
    const deployedContract = await TokenPresale.deploy(100000000000000, deployedERC20.address, 8);
    await deployedContract.deployed();
    console.log("--deployed presale contract", deployedContract.address);
    
}

main().then(() => process.exit(0)).catch( (err) =>
    {
        console.log(err);
        process.exit(1);
    }
)