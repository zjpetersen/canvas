import React from "react";
import Web3 from "web3";
import GetUnclaimedTile from "./GetUnclaimedTile";
import SetColor from "./SetColor";
import SetAsk from "./SetAsk";
import SetOffer from "./SetOffer";
import {convertToDataUrl} from './Utils';

class DisplayTileDetails extends React.Component {
  state = { tile: null, tileId: null, canvas: null, offerRef: null};

  getOwner = (tile) => {
    if (tile) {
      if (tile.owner !== '0x0000000000000000000000000000000000000000') {
        return <p>Owner: {tile && tile.owner}</p>;
      } else {
        return <p>No owner, claim the tile now</p>
      }
    }
    return;
  }

  getPicture = (tile) => {
    if (tile) {
      let imgSrc = tile.color;
      if (tile.invalidColor) {
        return <p style={{color:"red"}}>Image: An invalid image was uploaded.  Please reupload a 16x16 png image.</p>
      } else if (imgSrc.startsWith('0x') && imgSrc.length > 2) {
        imgSrc = convertToDataUrl(imgSrc);
      }
      if (imgSrc.startsWith("data:image")) {
        return <img id="detailedImg" src={imgSrc} alt="Tile"/>;
      }
    }
    return;
  }

  getAsk = (tile) => {
    if (tile) {
      if (tile.ask !== '0') {
        return <p>Ask: {tile && Web3.utils.fromWei(tile.ask)}</p>;
      } else {
        return <p>No ask has been set.</p>
      }
    }
    return;
  }

  getOffer = (highestOffer) => {
      if (highestOffer.amount !== '0') {
        return <p>Highest offer: {Web3.utils.fromWei(highestOffer.amount)} ether</p>
      } else {
        return <p>No offers yet.</p>
      }
  }

  highestOffer = (offers) => {
    let highestOffer = { amount: '0', offerer: '0x' };
    if (offers && offers.value) {
      for (let i = 0; i < offers.value.length; i++) {
        if (highestOffer.amount < offers.value[i].amount) {
          highestOffer = offers.value[i];
        }
      }
    }
    return highestOffer;
  }

  getTileDetails = () => {
    if (!this.props.tilesObj || !this.props.owner) {
      return;
    }
    // if (!this.props.offerRef || !this.props.tilesObj || !this.props.owner || !this.props.ask) {
    //   return;
    // }

    const { MosaicTiles } = this.props.drizzleState.contracts;
    // const offers = MosaicTiles.getOffersForTile[this.props.offerRef];
    const owner = MosaicTiles.getOwner[this.props.owner];
    // const ask = MosaicTiles.getAsk[this.props.ask];
    const secObj = this.props.tilesObj[this.props.tileId];
    // let highestOffer = this.highestOffer(offers);
    
      return (
        <div>
          <div className="center">
            <p>Tile details for tile {this.props.tileId}</p>
            {this.getPicture(secObj)}
            {this.getOwner(secObj)}
            {/* {this.getAsk(secObj)} */}
            {/* {this.getOffer(highestOffer)} */}
          </div>
          <GetUnclaimedTile
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            tileId={this.props.tileId}
            owner={owner && owner.value}
            tilesObj={secObj}
          />
          {/* <SetOffer
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            tileId={this.props.tileId}
            owner={owner && owner.value}
            ask={ask && ask.value}
            tilesObj={secObj}
          /> */}
          <SetColor
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            tileId={this.props.tileId}
            owner={owner && owner.value} 
            tilesObj={secObj}
          />
          {/* <SetAsk
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            tileId={this.props.tileId}
            owner={owner && owner.value}
            ask={ask && ask.value}
            highestOffer={highestOffer}
            tilesObj={secObj}
          /> */}

        </div>
      );
  }

  render() {
    return (
      <div>
        <div>{this.getTileDetails()}</div>
      </div>
    );
  }
}

export default DisplayTileDetails;