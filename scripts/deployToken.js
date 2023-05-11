const { ethers } = require("hardhat");

async function main() {
    const [owner, signer2] = await ethers.getSigners();

    Dhiraj = await ethers.getContractFactory('Dhiraj', owner);
    dhiraj = await Dhiraj.deploy();

    Rayyan = await ethers.getContractFactory('Rayyna', owner);
    rayyan = await Rayyan.deploy();

    PopUp = await ethers.getContractFactory('PopUp', owner);
    popUp = await PopUp.deploy();

    await dhiraj
        .connect(owner)
        .mint(signer2.address, ethers.utils.parseEther("100000"))
    
    await rayyan
        .connect(owner)
        .mint(signer2.address, ethers.utils.parseEther("100000"))

    await popUp
        .connect(owner)
        .mint(signer2.address, ethers.utils.parseEther("100000"))

    console.log(`dhirajAddress = '${dhiraj.address}'`);
    console.log(`rayyanAddress = '${rayyan.address}'`);
    console.log(`popUpAddress = '${popUp.address}'`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });