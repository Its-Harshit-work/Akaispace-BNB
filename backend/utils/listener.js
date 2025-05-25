// listener.js
const { ethers } = require("ethers");
const User = require("./models/user");

// Load environment variables
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.BNB_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;

// Contract ABI: include only the relevant event
const abi = [
  "event CreditsPurchased(address indexed buyer, uint256 bnbAmount, uint256 creditAmount)"
];

const contract = new ethers.Contract(contractAddress, abi, provider);

function startCreditListener() {
  console.log("🎧 Listening for CreditsPurchased events...");

  contract.on("CreditsPurchased", async (buyer, bnbAmount, creditAmount) => {
    try {
      const credits = creditAmount.toNumber();
      const wallet = buyer.toLowerCase();

      // Update user's credits in DB
      const result = await User.updateOne(
        { walletAddress: wallet },
        { $inc: { credits: credits } }
      );

      if (result.modifiedCount === 0) {
        console.warn(`⚠️ No user found with wallet: ${wallet}`);
      } else {
        console.log(`✅ Credited ${credits} to ${wallet}`);
      }
    } catch (error) {
      console.error("❌ Error processing CreditsPurchased event:", error);
    }
  });
}

module.exports = { startCreditListener };
