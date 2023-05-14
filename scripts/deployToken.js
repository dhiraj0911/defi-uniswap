const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();

    Dhiraj = await ethers.getContractFactory('Dhiraj');
    dhiraj = await Dhiraj.deploy();

    Rayyan = await ethers.getContractFactory('Rayyna');
    rayyan = await Rayyan.deploy();

    PopUp = await ethers.getContractFactory('PopUp');
    popUp = await PopUp.deploy();

    // await dhiraj
    //     .connect(owner)
    //     .mint(signer2.address, ethers.utils.parseEther("100000"))
    
    // await rayyan
    //     .connect(owner)
    //     .mint(signer2.address, ethers.utils.parseEther("100000"))

    // await popUp
    //     .connect(owner)
    //     .mint(signer2.address, ethers.utils.parseEther("100000"))

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