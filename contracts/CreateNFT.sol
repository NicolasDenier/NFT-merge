//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Card is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFT Game Card", "GC") {}

    mapping(uint256 => string) categories;
    mapping(uint256 => uint256) categories_level;
    mapping(uint256 => address) private _owners;

    function ownerOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        address owner = _owners[tokenId];
        require(
            owner != address(0),
            "ERC721: owner query for nonexistent token"
        );
        return owner;
    }

    function upper_level(uint256 tokenId) public returns (uint256) {
        uint256 level = categories_level[tokenId];
        level += 1;
        return level;
    }

    function mintNFT(
        address recipient,
        string memory tokenURI,
        string memory category,
        uint256 level
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        categories[newItemId] = category;
        categories_level[newItemId] = level;

        return newItemId;
    }

    function merge(
        uint256 tokenId1,
        uint256 tokenId2,
        string memory tokenURI
    ) public {
        if (
            keccak256(bytes(categories[tokenId1])) ==
            keccak256(bytes(categories[tokenId2]))
        ) {
            address recipient = ownerOf(tokenId1); // make something to decide who owns the new NFT
            uint256 level = upper_level(tokenId1);

            mintNFT(recipient, tokenURI, categories[tokenId1], level);

            // burn the two NFTs
            _burn(tokenId1);
            _burn(tokenId2);
        }
    }
}
