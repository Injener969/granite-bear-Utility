// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Granite Bear Utility (GBU)
 * @dev Deflationary RWA token for the granite B2B sector.
 * Features:
 * - Fixed Supply: 969,000,000 GBU (Minted entirely at generation).
 * - Burnable: Built-in functionality for users to burn tokens to receive discounts.
 * - No Minting: Total supply can only decrease, never increase.
 */
contract GraniteBearUtility is ERC20, ERC20Burnable, Ownable {
    // 969 million tokens with 18 decimal places (standard for ERC20)
    uint256 private constant INITIAL_SUPPLY = 969_000_000 * 10**18;

    constructor(address initialOwner) 
        ERC20("Granite Bear Utility", "GBU") 
        Ownable(initialOwner) 
    {
        // Mint the entire absolute supply to the contract deployer.
        // There is no mint() function in this contract, so no more can ever be created.
        _mint(initialOwner, INITIAL_SUPPLY);
    }
}
