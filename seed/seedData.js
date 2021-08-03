var MosaicMarket = artifacts.require("MosaicMarket");

 let sectionId5 = 5;
 const SECTION_ID_NEG = -1;
 const SECTION_ID_INVALID = 7056;
 const PRICE_1 = "500000000000000000"; //.5 ether
 const PRICE_2 = "3000000000000000000"; //3 ether
 const PRICE_3 = "100000000000000000"; //.1 ether

module.exports = async function(done) {
    console.log("Getting deployed version of Canvas...");
    const accounts = await web3.eth.getAccounts();
    const canvas = await MosaicMarket.deployed();

    console.log("Assigning section 5...");
    await canvas.getSectionForFree(sectionId5, {from: accounts[0]});
    console.log("Creating some offers for section 5");
    await canvas.offer(sectionId5, {from: accounts[1], value: PRICE_3});
    await canvas.offer(sectionId5, {from: accounts[2], value: PRICE_1});
    
    
    
    done();
    
};