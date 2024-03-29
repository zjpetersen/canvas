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
    this.state = { tilesArray: null, tiles: null, canvas: null, currentTileId: null, tileOffers: null, owner: null, ask: null, highlightTile: null, showUtilities: false, noOwnedTiles: false, result: null, load: true};
    this.setCurrentTile = this.setCurrentTile.bind(this);
    this.getColor = this.getColor.bind(this);
    this.highlightTile = this.highlightTile.bind(this);
    this.highlightOwnedTiles = this.highlightOwnedTiles.bind(this);
    this.clearHighlights = this.clearHighlights.bind(this);
    this.showUtilities = this.showUtilities.bind(this);
    // this.withdrawFunds = this.withdrawFunds.bind(this);
    this.loading = this.loading.bind(this);

  }

  componentDidMount() {
    fetchTiles(this, function (parent, data) {
      parent.setState({tilesArray : data});
    });
  }

  setCurrentTile(i) {
    this.setState({currentTileId : i});
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
        return "#fff8ee";
      } else {
        if (i % 10 === 0) {
          return "#4180a0";
        }
        return "#7d7d7d";
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
      let id = "canvasElement";
      let imgId = "canvasImg";
      if (this.state.highlightTile) {
        if (this.state.highlightTile.includes(i)) {
          //Only want to highlight div if the image is empty
          if (!imgSrc.startsWith("data:image") || (!tile.updatedColor && !tile.invalidColor)) {
            id = "canvasElementHighlight";
          }
          imgId = "canvasImgHighlight";
        } else {
          id = "canvasElementGray";
        }
      }
      if (tile.updatedColor && tile.invalidColor) {
          //Error image
          imgSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHFJREFUOI29krENwCAMBJ+IiajoWSFjZgV6V6yUVEYowQ8SKNcC/2cAIFwh3GwdAA52OMc4DDEDZnGsXUkiOEvp7l02+AS07UkEAMDuYq/Be/YWy2KfAWtnFtRgFFgDrHZ9BWaxbOBmZu+hv9Nbqr/xAJb7NyqaUbClAAAAAElFTkSuQmCC";
          let image = <img id={imgId} src={imgSrc} alt="Tile"/>
          row.push(<div id={id} key={i} onClick={() => this.setCurrentTile(i)}>{image}</div>);
      } else if (imgSrc.startsWith("data:image")) {
          let image = <img id={imgId} src={imgSrc} alt="Tile"/>
          row.push(<div id={id} key={i} onClick={() => this.setCurrentTile(i)}>{image}</div>);
      } else {
        let style = {
          backgroundColor: this.getColor(tile, i),
          // border: "1px solid #383838"
        }
        row.push(<div id={id} key={i} style={style} onClick={() => this.setCurrentTile(i)} />);
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

  /************ Mosaic Utility Functions */

  handleHighlightTileChangeAmount(event) {
    this.setState({highlightTilePending: event.target.value });
  }

  handleHighlightTileSubmit(event) {
      event.preventDefault();
    this.setState({highlightTile: [Number(this.state.highlightTilePending)]});
    this.reload();
    console.log("Highlight tile: " + [this.state.highlightTilePending]); 
  }

  handleHighlightOwnedTilesSubmit(event) {
    const { drizzleState } = this.props;
    let toHighlight = [];

    let tiles = this.state.tilesArray;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].owner === drizzleState.accounts[0]) {
        toHighlight.push(i);
      }
    }

    console.log(toHighlight);
    if (toHighlight.length !== 0) {
      this.setState({highlightTile: toHighlight, noOwnedTiles: false});
      this.reload();
    } else {
      this.setState({noOwnedTiles: true});
    }
  }

  handleClearHighlightsSubmit(event) {
    this.setState({highlightTile: null});
    this.reload();
  }

  handleShowUtilities(event) {
    this.setState({showUtilities: !this.state.showUtilities});
  }

  highlightTile = () => {
    return <div className="util">
      <form onSubmit={(event) => this.handleHighlightTileSubmit(event)}>
        <label> Highlight Tile:
                <input
            name="tile"
            type="number"
            step="1"
            min="0"
            max="7055"
            value={this.state.amount}
            onChange={(event) => this.handleHighlightTileChangeAmount(event)} />
        </label>
        <input className="margin" type="submit" value="Submit" />
      </form>
    </div>

  }

  highlightOwnedTiles = () => {
    if (!this.props.isMetaMask) {
      return;
    }
    if (this.state.noOwnedTiles) {
      alert("No owned tiles! ");
      this.setState({noOwnedTiles: false});
    }
        return <div className="util">
          <button className="small" type="button" onClick={(event) => this.handleHighlightOwnedTilesSubmit(event)}>Highlight Owned Tiles</button>
        </div>
  }
  
  clearHighlights = () => {
    if (this.state.highlightTile) {
        return <div className="util">
          <button className="small" type="button" onClick={() => this.handleClearHighlightsSubmit()}>Clear Highlights</button>
        </div>
    }
  }

  // withdrawFunds = () => {
  //   return <div className="util">
  //     <button className="small" type="button" onClick={() => this.handleWithdrawSubmit()}>Withdraw funds</button>
  //   </div>
  // }

  showUtilities = () => {
        let msg = !this.state.showUtilities ? "Show Utilities" : "Hide Utilities";
        return <div className="util">
          <button className="small" type="button" onClick={() => this.handleShowUtilities()}>{msg}</button>
        </div>
  }

  mosaicUtilites = () => {
    if (!this.state.tilesArray) {
      return;
    }
    if (!this.state.showUtilities) {
      return <div id="mosaicUtils" className="left">
        {this.showUtilities()}
      </div>
    }
    return <div id="mosaicUtils" className="left">
      {this.showUtilities()}
      {this.highlightTile()}
      {this.highlightOwnedTiles()}
      {this.clearHighlights()}
      {/* {this.withdrawFunds()} */}
    </div>

  }

  /**********End Mosaic Utility Functions */

  buildCanvas = () => {
    if (!this.state.tilesArray) {
      return this.loading();
    }
    //Cache the results to load faster when tiles are clicked on
    if (!this.state.load) {
      return <div id="divCanvas">{this.state.result}</div>;
    }
    let tiles = this.state.tilesArray;

    let result = [];
    let currTime = Date.now();

    for (let i = 0; i < tiles.length; i+=ROW_SIZE) {
        result.push(this.buildRow(tiles, i, i+ROW_SIZE, ROW_SIZE));
    }
    this.setState({result: result, load: false});
    let ms = Date.now() - currTime;
    // console.log("Time to load canvas: " + ms);

    return <div id="divCanvas">{result}</div>;
  }

  //Used for child components to reload the mosaic
  reload = () => {
    this.setState({load: true});
  }

  getHtmlCanvas = () => {
    let style={
      border: "1px solid #000000",
    };
    let result = <canvas id="myCanvas" width={WIDTH} height={HEIGHT} style={style} ></canvas>;
    return result;
  }

  checkIdParam = () => {
    if (!this.props.tileId) {
      return;
    }
    let id = parseInt(this.props.tileId.match.params.tileId);

    if (this.state.currentTileId === null && Number.isInteger(id) && id > -1 && id < 7056) {
      this.setCurrentTile(id);
    }

  }

  render() {
    this.checkIdParam();
    return (
      <div id="center">
        {this.buildCanvas()}
        {this.mosaicUtilites()}

        
        <DisplayTileDetails
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
          tilesObj = {this.state.tilesArray}
          tileId={this.state.currentTileId}
          offerRef={this.state.tileOffers}
          ask={this.state.ask}
          isMetaMask={this.props.isMetaMask}
          reload = {this.reload}
        />
      </div>
    );
  }
}

export default DisplayCanvas;