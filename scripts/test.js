require('dotenv').config();
const filename='new_img_test.png';

async function get_image(url){
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

async function combine_images(CID1, CID2){
    const { Image } = require('image-js');
    const base_url = "https://gateway.pinata.cloud/ipfs/";
    let url1 = base_url+CID1;
    let url2 = base_url+CID2;

    let buffer1 = await get_image(url1);
    let buffer2 = await get_image(url2);

    let image2 = await Image.load(buffer2);

    let merged_img = await Image.load(buffer1).then(function (image1) {
        let new_img = image1.resize({width:2*image1.width, height:image1.height});
        new_img.insert(image1, {inPlace:true});
        new_img.insert(image2, {x: image1.width,inPlace:true});
        new_img.save(filename);
        return new_img.toBuffer();
    });

    return merged_img;

    // (ideally the axis depends on the parity of the level attribute)
}

let CID = '';
let CID1 = 'QmQfXfbjEanGVF81oAJzxkvxcVo2NjoNVkyY8tUhaFG5sN';
let CID2 = 'QmcsjCNxidtWdLRWBCWEw74pgNTUCgiYux9pA7K636gW2d';
merged_img = combine_images(CID1, CID2);


const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const JWT = `Bearer ${process.env.PINATA_JWT}`;

const pinFileToIPFS = async () => {
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
      CID = res.data['IpfsHash'];
    } catch (error) {
      console.log(error);
    }
    
}

setTimeout(async () => {
  await pinFileToIPFS();
}, 2000);