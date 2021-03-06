'use strict';

const fs = require('fs');
const Web3 = require('web3');

const config = require('../config');

const ABI = fs.readFileSync(__dirname + "/ABI.txt", "utf8").trim();
const address = fs.readFileSync(__dirname + "/contractAddress.txt", "utf8").trim();

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.getGethUrl()));
web3.eth.defaultAccount = web3.eth.accounts[0]; // otherwise have to specify `from` while making each transaction
const contractInstance = web3.eth.contract(JSON.parse(ABI)).at(address);


const getLeaderboard = () => {
  const response = contractInstance.getLeaderboard();
  const users = response[0];
  const scores = response[1];

  const leaderboard = [];

  for (let i = 0; i < users.length; i++) {
    leaderboard.push({
      username: hexToAscii(users[i]),
      balance: parseInt(scores[i])
    });
  }
  return leaderboard;
};

const getUserBalance = username => {
  return parseInt(contractInstance.getBalance(username));
};

const placeBet = (username, prediction, betAmount) => {
  return contractInstance.placeBet.sendTransaction(username, prediction, betAmount);
};

const registerUser = username => {
  return contractInstance.register.sendTransaction(username);
};


// admin functions
const createNewRound = () => {
  return contractInstance.newRound.sendTransaction();
};

const declareRound = () => {
  return contractInstance.declare.sendTransaction();
};

const resolveRound = () => {
  return contractInstance.resolve.sendTransaction();
};

// smart contract returns text in ascii
const hexToAscii = hex => web3.toAscii(hex).replace(/\u0000/g, '');

module.exports = {
  getLeaderboard,
  getUserBalance,
  placeBet,
  registerUser,

  // admin functions
  createNewRound,
  declareRound,
  resolveRound
};
