// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GraniteBearClub is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string private _baseTokenURI;
    uint256 private _nextTokenId = 1;

    uint256 public constant MAX_SUPPLY = 500;
    
    // Tiers distribution:
    // Gold: 1 - 100 (100 tokens)
    // Silver: 101 - 250 (150 tokens)
    // Bronze: 251 - 500 (250 tokens)

    constructor(string memory initialBaseURI) ERC721("Granite Bear Club", "GBC") Ownable(msg.sender) {
        _baseTokenURI = initialBaseURI;
    }

    /**
     * @dev Mint multiple NFTs to a recipient. Only callable by the owner.
     */
    function mintBatch(address to, uint256 count) external onlyOwner {
        require(_nextTokenId + count - 1 <= MAX_SUPPLY, "Would exceed max supply");
        for (uint256 i = 0; i < count; i++) {
            _safeMint(to, _nextTokenId);
            _nextTokenId++;
        }
    }

    /**
     * @dev Overrides the basic requireOwned / tokenURI to map correctly to 1.json, 2.json, 3.json
     * based on the token ID tier.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId); // Reverts if not minted yet (OpenZeppelin 5.x)

        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) {
            return "";
        }

        string memory jsonFile = "3.json"; // Default Bronze
        if (tokenId >= 1 && tokenId <= 100) {
            jsonFile = "1.json"; // Gold
        } else if (tokenId >= 101 && tokenId <= 250) {
            jsonFile = "2.json"; // Silver
        } else if (tokenId >= 251 && tokenId <= 500) {
            jsonFile = "3.json"; // Bronze
        }

        return string.concat(baseURI, jsonFile);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
}
