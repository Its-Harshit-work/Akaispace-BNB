import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_CREDIT_PRICE_WEI = 74000000000000n; // 0.000074 BNB in Wei
const INITIAL_OWNER_ADDRESS = "0xD9bE171CEcfCdb831CD870C6a2C16A153E536c57";

const CreditStoreModule = buildModule("CreditStoreModule", (m) => {
  const creditStore = m.contract("CreditStore", [INITIAL_CREDIT_PRICE_WEI, INITIAL_OWNER_ADDRESS]);

  return { creditStore };
});

export default CreditStoreModule; 