# NFT game

Find a matching image (belonging to someone else),  
merge them into a new NFT with more value, only one owner.

Set up from: [Create NFT with hardhat](https://capbloc.notion.site/Create-NFT-with-hardhat-9a20a10237924d518597656cad8de7b0)

## Installation

- Copy files (git clone)
- Install dependancies: `npm install`

## Usage

For now, only `scripts/test.js` can be used safely.
It is a demonstration independant of the blockchain.  
This script will fetch two images from pinata, merge them (save it as an image) and post it to pinata.

To run a script (try only with test.js):  
`node scripts/test.js`  
Other scripts (not recommanded):  
`npx hardhat run scripts/myscript.js --network mumbai`

## Steps

- Deploy smart contract (deploy.js)
- Upload an image to pinata (x2)
- Upload metadata to pinata (x2)
- Mint NFT (mintNFT.js) (x2)
- Merge NFTs from the two images (mergeNFTs.js)
  automatically get images, merge them, send them to pinata, generate and send metadata to pinata and mint a new NFT, burning the two other
