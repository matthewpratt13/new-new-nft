import { waffle } from "hardhat";
import { BigNumber, Contract, Wallet } from "ethers";
import { expect } from "chai";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import sinon from "sinon";
import { deployTestContract, getTestWallet } from "./test-helper";
import * as provider from "../lib/provider";

describe("NewNewNFT", () => {
    const TOKEN_URI = "http://example.com/ip_records/42";
    let deployedContract: Contract;
    let wallet: Wallet;

    beforeEach(async () => {
        sinon.stub(provider, "getProvider").returns(waffle.provider);
        [wallet] = waffle.provider.getWallets();
        deployedContract = await deployTestContract("NewNewNFT");
    });

    async function getTokenId(): Promise<BigNumber> {
        return deployedContract._tokenId();
    }

    // mimics new transfer() method with `whenPaused` modifier active
    async function transfer(): Promise<TransactionResponse> {
        return deployedContract.transfer(
            wallet.address,
            getTestWallet().address,
            getTokenId()
        );
    }

    describe("pauseNFT", () => {
        it("pauses transfer of the NFT", async () => {
            await expect(await deployedContract.pause(getTokenId(), 2))
                .to.emit(deployedContract, "Paused")
                .withArgs(wallet.address);
        });

        it("cannot transfer when paused", async () => {
            await deployedContract.pause(getTokenId(), 2);
            await expect(transfer()).to.be.revertedWith("Pausable: paused");
        });

        it("unpauses transfer of the NFT", async () => {
            await deployedContract.pause(getTokenId(), 2);
            await expect(await deployedContract.unpause(getTokenId()))
                .to.emit(deployedContract, "Unpaused")
                .withArgs(wallet.address);
        });
    });
});
