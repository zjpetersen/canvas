const Canvas = artifacts.require("./Canvas.sol");
const truffleAssert = require('truffle-assertions');

contract("Canvas", (accounts) => {
 let canvas;
 let sectionId = 15;
 let expectedOwner;

 before(async () => {
     canvas = await Canvas.deployed();
 });

 describe("test get owner", async () => {
   it("can get owner", async () => {
     const actualOwner = await canvas.getOwner(sectionId, {from :accounts[0]});

     assert.equal(actualOwner, '0x0000000000000000000000000000000000000000', "The owner of the free section should be first account");
   });

 });

 describe("test getting free sections", async () => {
  //  let expectedOwner;
   before("get a free section", async () => {
     await canvas.getSectionForFree(sectionId, { from: accounts[0] });
     expectedOwner = accounts[0];
   });

   it("can assign owner to free section properly", async () => {
     const actualOwner = await canvas.getOwner(sectionId);

     assert.equal(actualOwner, expectedOwner, "The owner of the free section should be first account");
   });

   it("cannot assign owner to already owned section", async () => {
     await truffleAssert.reverts(
       canvas.getSectionForFree(sectionId, { from: accounts[1] }));
   });

 });

 
 describe("test setting color", async () => {
  let expectedColor = "blue";

   it("cannot set color for non-owner", async () => {
     await truffleAssert.reverts(
       canvas.setColor(sectionId, expectedColor, { from: accounts[1] }));
   });

   it("can set color for owner", async () => {
     await canvas.setColor(sectionId, expectedColor, {from: accounts[0]});
     const color = await canvas.getColor(sectionId);

     assert.equal(color, expectedColor, "Color should be set");
   });

   it("cannot set color a second time", async () => {
     await truffleAssert.reverts(
       canvas.setColor(sectionId, "red", { from: accounts[0] }));
   });

 });
});