import React from 'react';
import './style/Home.css';
import EmailForm from './EmailForm';
import ExampleLarge from './media/ExampleLarge.png';

class Home extends React.Component {

  info = () => {
    let result = 
      <div className="row">
        <div className="column left">
        
        </div>
        <div className="column middle">
          <p>**Note EtherCanvas is currently deployed on the Rinkeby testnet.  Stay tuned for mainnet release!</p>

          <h2>How does it work?</h2>
          <p>EtherCanvas is a Dapp running on the ethereum blockchain.  
            It is a digital canvas made up of 7056 non-fungible tokens (tiles).  Tile owners are able to create their own artwork and add their updated tile to the <a href="/">Canvas</a>.
            All of the tiles are displayed next to each other to make the overall art piece.
            </p>
            

          <h2>What can I do with a tile?</h2>
          <p>There are a couple main ways to interact with the Canvas and with individual tiles: trading tiles and updating the artwork.</p>

          <h4>Trading tiles</h4>
          <p>Like other NFTs, you can buy and sell your NFT (the tile) whenever you want.  
            Trading can be done through any NFT marketplace, although <a href="https://testnets.opensea.io/collection/ethercanvas">OpenSea</a> is where they will be initially listed. 
            If you are interested in purchasing a tile, checkout the 'How Can I purchase a tile?' section below.
            </p>

          <h4>Updating the artwork</h4>
          <p>What sets EtherCanvas apart from other NFTs is the ability to update the artwork.  In order to do this, you must first be the owner of a tile.
            Then you can upload a new image to your tile, and that image will be displayed on the Canvas for everyone else to see!  In order to fit as many tiles onto the
            Canvas as possible, images are limited to 16x16 pixels.
          </p>
          <div className="row">
            <img id="exampleLarge" src={ExampleLarge} alt="Canvas example" />
          </div>

          <h2>Are tiles unique?</h2>
          <p>Yes, each tile represents a unique portion of the canvas and cannot be moved.  
            However, unlike other NFTs, the owner is able to change the tile artwork.
            You can think of the tile as a plot of land.  As long as you own the land, you are free to put whatever you want on it.</p>

          <h2>How can I purchase a tile?</h2>
            <ol>
              <li>Install the Chrome extension <a href="https://metamask.io/">MetaMask</a>.</li>
              <li>Send some Ethereum to your MetaMask wallet.  For example, from your Coinbase wallet.</li>
              <li>Navigate to the <a href="https://testnets.opensea.io/collection/ethercanvas">OpenSea Testnet collection</a> and pick a tile you're interested in.</li>
              <li>Click the 'Buy Now' button.  Congratulations! You now have your own NFT!</li>
              <li>Check out the <a href="https://support.opensea.io/hc/en-us/articles/360063518033-How-do-I-buy-fixed-price-NFTs-">OpenSea documentation</a> for detailed instructions.</li>
            </ol>
          
          <h2>Other technical details</h2>
            <ul>
              <li>There are 7056 total tiles (63 rows and 112 columns).  Each tile is 16x16 pixels wide.  This means the Canvas is 1008x1794 pixels, which fits on a 1080p screen with just a bit to spare. </li>
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
        <EmailForm />
        <div className="row footer">

          <div className="column left">
            <a href="https://twitter.com/EtherCanvasNFT" className="fa fa-twitter"></a>
            <a className="fa fa-github" href="https://github.com/zjpetersen/canvas-contracts"></a>
          </div>
          <div className="column middle">
            Polygon: 0xb8120f116f88942ACF50B1d797977FefDaB206e0
            <br></br>
            <br></br>
            Testnet: 0x59b6722596e25a8721AB26664a2AfbF1C7D90818
          </div>
          <div className="column right">
            <a className="linkButton" href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    );
}
}

export default Home;