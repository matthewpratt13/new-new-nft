import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "dotenv/config";
import "./tasks/deploy";
import "./tasks/mint";

const config: HardhatUserConfig = {
    solidity: "0.8.14",
};

export default config;
