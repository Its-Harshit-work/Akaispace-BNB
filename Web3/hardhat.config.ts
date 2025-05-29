import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Ensure your configuration variables are set before executing the script
const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    bscTestnet: {
      url: "https://bsc-testnet-rpc.publicnode.com",
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
