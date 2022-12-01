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

    function mintNFT(
        address recipient,
        string memory tokenURI,
        string memory category
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        categories[newItemId] = category;

        return newItemId;
    }

    function merge(
        uint256 tokenId1,
        uint256 tokenId2,
        string memory tokenURI,
        string memory category
    ) public {
        if (
            keccak256(bytes(categories[tokenId1])) ==
            keccak256(bytes(categories[tokenId2]))
        ) {
            address recipient = ownerOf(tokenId1); // make something to decide who owns the new NFT

            mintNFT(recipient, tokenURI, category);

            // burn the two NFTs
            _burn(tokenId1);
            _burn(tokenId2);
        }
    }
}
