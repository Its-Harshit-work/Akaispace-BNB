// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreditStore
 * @dev A smart contract for purchasing credits with BNB.
 * Emits an event upon successful purchase, which can be monitored by a backend service.
 */
contract CreditStore is Ownable {
    uint256 public creditPriceInWei; // Price of one credit in Wei

    /**
     * @dev Event emitted when credits are purchased.
     * Matches the event definition in the provided listener.js.
     * - buyer: The address that purchased the credits.
     * - bnbAmount: The amount of BNB paid.
     * - creditAmount: The number of credits purchased.
     */
    event CreditsPurchased(
        address indexed buyer,
        uint256 bnbAmount,
        uint256 creditAmount
    );

    /**
     * @dev Sets the initial credit price and transfers ownership to the deployer.
     * @param _initialCreditPriceInWei The initial price for one credit, in Wei.
     * @param _initialOwner The address of the initial owner.
     */
    constructor(uint256 _initialCreditPriceInWei, address _initialOwner) Ownable(_initialOwner) {
        require(_initialCreditPriceInWei > 0, "Credit price must be positive");
        creditPriceInWei = _initialCreditPriceInWei;
    }

    /**
     * @dev Allows a user to purchase a specified number of credits.
     * The user must send BNB equal to `_numberOfCredits * creditPriceInWei`.
     * @param _numberOfCredits The number of credits to purchase.
     */
    function purchaseCredits(uint256 _numberOfCredits) public payable {
        require(_numberOfCredits > 0, "Must purchase at least one credit");
        
        uint256 expectedWei = _numberOfCredits * creditPriceInWei;
        require(msg.value == expectedWei, "Incorrect BNB amount for credits");

        emit CreditsPurchased(msg.sender, msg.value, _numberOfCredits);
    }

    /**
     * @dev Allows the owner to set a new price for credits.
     * @param _newCreditPriceInWei The new price for one credit, in Wei.
     */
    function setCreditPrice(uint256 _newCreditPriceInWei) public onlyOwner {
        require(_newCreditPriceInWei > 0, "Credit price must be positive");
        creditPriceInWei = _newCreditPriceInWei;
    }

    /**
     * @dev Allows the owner to withdraw the accumulated BNB from the contract.
     */
    function withdrawBNB() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No BNB to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "BNB withdrawal failed");
    }

    /**
     * @dev Fallback function to receive BNB. Not strictly necessary with a payable purchase function
     * but can be useful if BNB is sent directly to the contract without calling a function.
     * However, such direct sends won't trigger credit purchases or events.
     */
    receive() external payable {}
} 