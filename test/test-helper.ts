import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import { ethers as hardhatEthers, waffle } from "hardhat";
import { Contract, Wallet } from "ethers";

chai.use(sinonChai);

afterEach(() => {
    sinon.restore();
});

export async function deployTestContract(name: string): Promise<Contract> {
    const contractFactory = await hardhatEthers.getContractFactory(
        name,
        getTestWallet()
    );
    return await contractFactory.deploy();
}

export function getTestWallet(): Wallet {
    return waffle.provider.getWallets()[0];
}
