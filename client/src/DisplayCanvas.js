import React from "react";
import DisplayTileDetails from './DisplayTileDetails';
import './style/DisplayCanvas.css';
import loadingGif from './media/Spinner-1s-200px.gif';
import {convertToDataUrl} from './Utils';
import {fetchTiles} from './HttpClient';

const WIDTH = 160;
const HEIGHT = 160;
const ROW_SIZE = 112; 


class DisplayCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tilesArray: null, tiles: null, canvas: null, currentTileId: null, tileOffers: null, owner: null, ask: null};
    this.setCurrentTile = this.setCurrentTile.bind(this);
    this.getColor = this.getColor.bind(this);
    this.loading = this.loading.bind(this);

  }

  componentDidMount() {
    fetchTiles(this, function (parent, data) {
      console.log("Update tiles array");
      console.log(data);
      parent.setState({tilesArray : data});
      console.log(parent.state);
    });
  }

  setCurrentTile(i) {
    const { drizzle } = this.props;
    const canvas = drizzle.contracts.MosaicMarket;

    // let drizzle know we want to call the `checkTile` method with `value`
    const owner = canvas.methods["getOwner"].cacheCall(i);
    const ask= canvas.methods["getAsk"].cacheCall(i);
    const offerRef = canvas.methods["getOffersForTile"].cacheCall(i);

    this.setState({currentTileId : i, tileOffers: offerRef, owner: owner, ask: ask});
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getColor(tile, i) {
      if (tile.owner !== "0x0000000000000000000000000000000000000000") {
        return "#7d7d7d";
      } else {
        if (i % 10 === 0) {
          return "#8b658f";
        }
        return "#f2eac9";
      }
  }

  buildRow = (tiles, start, end, ROW_SIZE) => {
    let row = [];
    for (let i = start; i < end; i++) {
      if (tiles.length === i) {
        break;
      }
      let tile = tiles[i];
      let imgSrc = tile.color;
      if (imgSrc.startsWith('0x') && imgSrc.length > 2) {
        imgSrc = convertToDataUrl(imgSrc);
      }
      if (imgSrc.startsWith("data:image")) {
        let image = <img id="canvasImg" src={imgSrc} alt="Tile"/>
        row.push(<div id="canvasElement" key={i} onClick={() => this.setCurrentTile(i)}>{image}</div>);
      } else {
        let style = {
          backgroundColor: this.getColor(tile, i),
          // border: "1px solid #383838"
        }
        row.push(<div id="canvasElement" key={i} style={style} onClick={() => this.setCurrentTile(i)} />);
      }

    }
    let rowId = "row" + (start / ROW_SIZE);
    return <div id="canvasRow" key={rowId} >{row}</div>;

  }
  
  loading = () => {
      return <div id="loading">
        <p>Loading the canvas...this will take a bit.</p>
        <img id="loading" src={loadingGif} alt="Loading"/>
      </div>;
  }

  buildCanvas = () => {
    if (!this.state.tilesArray) {
      return this.loading();
    }
    let tiles = this.state.tilesArray;

    let result = [];

    for (let i = 0; i < tiles.length; i+=ROW_SIZE) {
        result.push(this.buildRow(tiles, i, i+ROW_SIZE, ROW_SIZE));
    }

    return <div id="divCanvas">{result}</div>;
  }

  getHtmlCanvas = () => {
    let style={
      border: "1px solid #000000",
    };
    let result = <canvas id="myCanvas" width={WIDTH} height={HEIGHT} style={style} ></canvas>;
    return result;
  }

  render() {
    return (
      <div id="center">
        <h2>Canvas</h2>
        {this.buildCanvas()}
        
        <DisplayTileDetails
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
          tilesObj = {this.state.tilesArray}
          tileId={this.state.currentTileId}
          offerRef={this.state.tileOffers}
          owner={this.state.owner}
          ask={this.state.ask}
        />
      </div>
    );
  }
}

export default DisplayCanvas;