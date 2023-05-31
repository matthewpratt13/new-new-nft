// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// with thanks to the OZ Contracts Wizard (https://wizard.openzeppelin.com/)
contract NewNewNFT is ERC721, ERC721URIStorage, Pausable, Ownable {
    using Counters for Counters.Counter;

    uint256 constant MINT_PRICE = 2_000;

    Counters.Counter private _tokenIdCounter;
    uint256 public _tokenId = _tokenIdCounter.current();
    uint256 endPause;

    constructor() ERC721("NewNewNFT", "NFT") {}

    function pause(uint256 tokenId, uint256 timePaused) public onlyOwner {
        endPause = block.timestamp + timePaused * 1 hours;

        require(tokenId == _tokenId, "Invalid tokenId: unable to access external token");

        if (block.timestamp < endPause) {
            _pause();
        }
    }

    function unpause(uint256 tokenId) public onlyOwner whenPaused {
        require(tokenId == _tokenId, "Invalid tokenId: unable to access external token");

        _unpause();
    }

    function safeMint(address to, string memory uri) public payable onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();

        require(msg.value == MINT_PRICE, "Transaction value did not equal the mint price");

        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function transfer(address from, address to, uint256 tokenId) public whenNotPaused {
        _transfer(from, to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
