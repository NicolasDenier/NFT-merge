// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

function get_image(url){
    image = fetch(url)
    .then(response => response.blob())
    .then(imageBlob => {
            return imageBlob // process image ?
  });
  return image;
}

function combine_images(CID1, CID2){
    const base_url = "https://gateway.pinata.cloud/ipfs/";
    let url1 = base_url+CID1;
    let url2 = base_url+CID2;

    let img1 = get_image(url1);
    let img2 = get_image(url2);

    // assemble images side by side (idk how)
    // (ideally the axis depends on the parity of the level attribute)
    return newImage;
}

function post_image(image) {
    // upload image to pinata
    // create metadata.json with image url, category, level, name, etc
    // Post metadata to pinata and get the associated tokenURI
    return tokenURI;
}

async function main(CID1, CID2) {

  TOKENURI = post_image(combine_images(CID1,CID2));

  const Card = await hre.ethers.getContractFactory("card");
  const card = await Card.attach(process.env.SMART_CONTRACT_ADDRESS);

  // get somehow the token ids from CID1 and CID2 (from metadata?)

  await card.merge(tokenId1, tokenId1, TOKENURI);

  console.log(
    `deployed to ${card.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});