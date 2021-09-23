import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Web3 from "web3";

// import drizzle functions and contract artifact
import { Drizzle } from "@drizzle/store";
import CryptoCanvas from "./contracts/CryptoCanvas.json";

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [CryptoCanvas],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
};

// setup drizzle
let drizzle;
if (!Web3.givenProvider) {
  console.log("No given web3 provider");
  ReactDOM.render(<App drizzle={drizzle} hasProvider={false} />, document.getElementById('root'));
} else {
  let web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545'); //TODO default as infura
  let networkId;
  web3.eth.net.getId().then(id => {
    // if (id === 1 || id === 4 || id === 5777) {
    if (id === 4 || id === 5777 || id === 137) {
      drizzle = new Drizzle(options);
    }
    networkId = id;
    ReactDOM.render(<App drizzle={drizzle} networkId={networkId} hasProvider={true}/>, document.getElementById('root'));
  });

}
