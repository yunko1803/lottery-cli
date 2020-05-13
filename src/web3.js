import Web3 from 'web3';

const provider = window.ethereum;
provider.enable();
const web3 = new Web3(provider);

export default web3;
