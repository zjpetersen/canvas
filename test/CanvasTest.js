const Canvas = artifacts.require("./Canvas.sol");
const truffleAssert = require('truffle-assertions');

contract("Canvas", (accounts) => {
 let canvas;
 let sectionId = 15;
 let expectedOwner;
 let sectionId1 = 1;
 let expectedOwner1;

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
     await canvas.getSectionForFree(sectionId1, { from: accounts[1] });
     expectedOwner1 = accounts[1];
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

 describe("test get all sections", async () => {
   it("can get all sections", async () => {
     const sections = await canvas.getSections({from :accounts[0]});
     const section = sections[sectionId];

     assert.equal(section.encodedColor, "blue", "Should be able to get color from sections");
   });

 });

 describe("test setting color bytes", async () => {
   let buffer = new ArrayBuffer();
   let expectedColor = new Int8Array(buffer);
  //  expectedColor = Int8Array.from([80,78,71,13,10,26,10,0,0,0,13,73]);
   expectedColor = Int8Array.from([-119, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 16, 0, 0, 0, 16, 8, 6, 0, 0, 0, 31, -13, -1, 97, 0, 0, 0, 1, 115, 82, 71, 66, 0, -82, -50, 28, -23, 0, 0, 0, -105, 73, 68, 65, 84, 56, -115, 99, -116, -50, 123, -8, -97, -127, -127, -127, -31, -8, -90, 96, 6, 116, 96, -23, -73, 22, -85, 56, 76, -114, -127, -127, -127, -127, 9, -97, -26, 39, 23, 39, -61, 21, -94, 3, -104, 30, 38, 92, 54, 16, 3]);
  //  let expectedColor = new Uint8Array(buffer);
  //  expectedColor = Uint8Array.from([80,78,71,13,10,26,10,0,0,0,13,73,245]);
   let hex = '0x';
   hex += Array.from(expectedColor, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');

  expectedColor = hex;
  // let hex = expectedColor;
   

  console.log("expected color: ");
  console.log(expectedColor);
  console.log("got expected color");

   it("cannot set color for non-owner", async () => {
     await truffleAssert.reverts(
       canvas.setColorBytes(sectionId1, expectedColor, { from: accounts[0] }));
   });

   it("can set color for owner", async () => {
     await canvas.setColorBytes(sectionId1, expectedColor, {from: accounts[1]});
     const color = await canvas.getColorBytes(sectionId1);

     assert.equal(color, hex, "Color should be set");
   });

   it("cannot set color a second time", async () => {
     await truffleAssert.reverts(
       canvas.setColorBytes(sectionId1, expectedColor, { from: accounts[1] }));
   });

 });

});
