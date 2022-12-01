// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const JWT = `Bearer ${process.env.PINATA_JWT}`
const imgname='new_img_test.png';


// Get an image (as buffer) from an url
async function get_image(url){
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

// Combine two images side by side from pinata
async function combine_images(CID1, CID2){
  const base_url = "https://gateway.pinata.cloud/ipfs/";
  let url1 = base_url+CID1;
  let url2 = base_url+CID2;

  // Get images from pinata
  let buffer1 = await get_image(url1);
  let buffer2 = await get_image(url2);

  // Image object can be easily processed with image-js library
  const { Image } = require('image-js');
  let image2 = Image.load(buffer2);

  let merged_img = await Image.load(buffer1).then(function (image1) {
      // new_img is twice as wide as image1 (image1 and image2 have the same size)
      // (ideally the enlarged axis depends on the parity of the level attribute)
      let new_img = image1.resize({width:2*image1.width, height:image1.height}); 
      // Place the first image at the left
      new_img.insert(image1, {inPlace:true});
      // Place the second image at the right
      new_img.insert(image2, {x: image1.width,inPlace:true});
      // save the new image
      new_img.save(imgname);
      return new_img.toBuffer();
  });
  return merged_img;
}

// Post a file to pinata
const pinFileToIPFS = async (filename) => {
  const formData = new FormData();
  const src = filename;
  
  const file = fs.createReadStream(src)
  formData.append('file', file)
  
  const metadata = JSON.stringify({
    name: filename,
  });
  formData.append('pinataMetadata', metadata);
  
  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options);

  try{
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT
      }
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

function create_metadata(CID) {
    // create metadata.json with image url, category, level, name, etc
    return tokenURI;
}

async function main(CID1, CID2) {

  combine_images(CID1,CID2)
  TOKENURI = setTimeout(function() {
    pinFileToIPFS(imgname);
  }, 2000);

  
  // Post metadata to pinata and get the associated tokenURI


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