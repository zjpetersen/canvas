import React from 'react';
import './style/Home.css';
import EthBefore from './media/EthBefore.png';
import EthBeforeSmall from './media/EthBeforeSmall.png';
import EthAfter from './media/EthAfter.png';
import EthAfterSmall from './media/EthAfterSmall.png';

class Home extends React.Component {

  info = () => {
    let result = 
      <div className="row">
        <div className="column left">
        
        </div>
        <div className="column middle">
          <h2>How does it work?</h2>
          <p>Canvas is a Dapp running on the ethereum blockchain.  
            It is a digital mosaic made up of 7056 unique tiles.  Tile owners are able to create their own artwork and add their updated tile to the mosaic.
            All of the tiles are displayed next to each other, just like a real world <a href="https://en.wikipedia.org/wiki/Mosaic">mosaic</a>.
            If other users find it valuable, they can purchase and modify the tile, or keep it the same.
            </p>
            

          <h2>What can I do with a tile?</h2>
          <p>There are three main ways to interact with the Mosaic and with individual tiles:</p>
          <ol>
            <li>Buying tiles</li>
            <li>Selling tiles</li>
            <li>Updating the artwork</li>
          </ol>

          <h4>Buying and selling tiles</h4>
          <p>Like other NFTs, you can buy and sell your NFT (the tile) whenever you want.  
            If you want to buy a tile you can submit an offer.  If the current owner is happy with the offer they can accept it.
            If you are the owner you are also able to sell your tile by creating an ask. Any future offer that matches the ask price will trigger a sale.</p>

          <h4>Updating the artwork</h4>
          <p>What sets Mosaic apart from other NFTs is the ability to change the artwork.  In order to do this, you must first be the owner of a tile.
            Then you can upload a new image to your tile, and that image will be displayed on the Mosaic for everyone else to see!  In order to fit as many tiles onto the
            Mosaic as possible, images are limited to 16x16 pixels.
          </p>

          <h4>Example of updating artwork</h4>
          <p>The mosaic has 4 tiles, which together form the ethereum logo.  Unfortunately, the previous artist uploaded the wrong color for one of the tiles.  Luckily though, this can easily be corrected!</p>

          <div className="row">
            <p id="inlineP">Given these 4 tiles:</p>
            <p id="inlineP">Update the top right one:</p>
            <p id="inlineP">The mosaic is now fixed!</p>
          </div>

          <div className="row">
            <img id="updateExBig" src={EthBefore} alt="Before mosaic" />
            <img id="updateEx" src={EthBeforeSmall} alt="Before tile" />
            <img id="updateEx" src={EthAfterSmall} alt="After tile" />
            <img id="updateExBig" src={EthAfter} alt="After mosaic" />
          </div>

          <h2>Are tiles unique?</h2>
          <p>Yes, each tile represents a unique portion of the mosaic and cannot be moved.  
            However, unlike other NFTs, the owner is able to change the tile artwork.
            You can think of the tile as a plot of land.  As long as you own the land, you are free to put whatever you want on it.</p>

          <h2>How can I purchase a tile?</h2>
            <ol>
              <li>Install the Chrome extension <a href="https://metamask.io/">MetaMask</a>.</li>
              <li>Send some Ethereum to your MetaMask wallet.  For example, from your Coinbase wallet.</li>
              <li>Navigate to the <a href="/canvas">Mosaic</a> and purchase a section you're interested in!</li>
            </ol>
          
          <h2>Other technical details</h2>
            <ul>
              <li>There are 7056 total tiles (63 rows and 112 columns).  Each tile is 16x16 pixels wide.  This means the Mosaic is 1008x1794 pixels, which fits on a 1080p screen with just a bit to spare. </li>
              <li>One might wonder what the gas fees are like for updating artwork.  To store even just 256 pixels worth of data on the blockchain would be very expensive.  To get around this, the art data is emitted as an event.  This makes it much cheaper, while still being fully decentralized and traceable.  </li>
            </ul>

        </div>
        <div className="column right"> </div>
      </div>
    return result;
  }

render() {
    return (
      <div>
      <div className="home content">
        {this.info()}
      </div>
      <div className="footer">Want to learn more? Check out our GitHub.</div>
     </div>
    );
}
}

export default Home;