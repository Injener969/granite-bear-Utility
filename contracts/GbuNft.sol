// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GBU Founders Club NFT
 * @dev NFT series for Granite Bear Utility supporters.
 */
contract GbuNft is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) 
        ERC721("GBU Founders Club", "GBUNFT") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Simple mint function for the owner to create new tokens.
     * @param to The address that will receive the NFT.
     * @param uri The metadata URI (IPFS link).
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}
