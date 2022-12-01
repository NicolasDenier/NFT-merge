require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config()


module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      gas: 1000000,
      url: process.env.MUMBAI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};