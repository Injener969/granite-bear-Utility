// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GbuSale is Ownable {
    IERC20 public gbuToken;
    IERC20 public usdtToken;
    
    uint256 public avaxRate; // How many GBU per 1 AVAX
    uint256 public usdtRate; // How many GBU per 1 USDT (assuming 6 decimals for USDT)

    event TokensPurchased(address buyer, uint256 amountSpent, uint256 amountGained, string method);

    constructor(address _gbuToken, address _usdtToken, uint256 _avaxRate, uint256 _usdtRate) Ownable(msg.sender) {
        gbuToken = IERC20(_gbuToken);
        usdtToken = IERC20(_usdtToken);
        avaxRate = _avaxRate;
        usdtRate = _usdtRate;
    }

    // Buy with AVAX
    receive() external payable {
        buyWithAvax();
    }

    function buyWithAvax() public payable {
        require(msg.value > 0, "Send AVAX to buy GBU");
        uint256 tokensToBuy = msg.value * avaxRate;
        _deliverTokens(tokensToBuy, "AVAX");
    }

    // Buy with USDT
    function buyWithUsdt(uint256 usdtAmount) public {
        require(usdtAmount > 0, "Amount must be > 0");
        // User must 'approve' the contract to spend their USDT first
        usdtToken.transferFrom(msg.sender, address(this), usdtAmount);
        
        // USDT has 6 decimals, GBU has 18. Calculation: Amount * Rate * 10^12
        uint256 tokensToBuy = usdtAmount * usdtRate * 1e12; 
        _deliverTokens(tokensToBuy, "USDT");
    }

    function _deliverTokens(uint256 amount, string memory method) internal {
        uint256 contractBalance = gbuToken.balanceOf(address(this));
        require(contractBalance >= amount, "Not enough GBU in store");
        gbuToken.transfer(msg.sender, amount);
        emit TokensPurchased(msg.sender, 0, amount, method);
    }

    // Settings
    function setRates(uint256 _avaxRate, uint256 _usdtRate) external onlyOwner {
        avaxRate = _avaxRate;
        usdtRate = _usdtRate;
    }

    // Withdraw funds
    function withdrawAll() external onlyOwner {
        // Collect AVAX
        payable(owner()).transfer(address(this).balance);
        // Collect USDT
        uint256 usdtBalance = usdtToken.balanceOf(address(this));
        if (usdtBalance > 0) usdtToken.transfer(owner(), usdtBalance);
    }

    function withdrawGbu(uint256 amount) external onlyOwner {
        gbuToken.transfer(owner(), amount);
    }
}
