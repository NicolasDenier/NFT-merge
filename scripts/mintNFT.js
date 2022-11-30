// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const categories = ['A','B'];
TOKENURI="https://gateway.pinata.cloud/ipfs/CID"; // this link is incorrect, replace CID with your image metadata CID on pinata

// Take randomly a category from a list
function generate_category(categories) {
  let randomIndex = Math.floor(Math.random()*categories.length);
  return categories[randomIndex];
}

async function main() {

  const Card = await hre.ethers.getContractFactory("card");
  const card = await Card.attach(process.env.SMART_CONTRACT_ADDRESS);

  // Metamask public key 
  // Token uri = metadata URL
  let category = generate_category(categories);
  await card.mintNFT(process.env.PUBLIC_KEY, TOKENURI, category, 1);

  console.log(
    `deployed to ${card.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});