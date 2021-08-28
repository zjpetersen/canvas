import React from "react";
import {Base64} from 'js-base64';
import './style/SetColor.css';
import './style/Alert.css';
import './style/DisplayCanvas.css';

class SetColor extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tileId: '', color: '', stackId: null, imageDisplayed: false, hex: '' };
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayColor = this.displayColor.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.getTxStatus = this.getTxStatus.bind(this);
    this.dataUrlFromInt8Array = this.dataUrlFromInt8Array.bind(this);
    this.bytesToHex = this.bytesToHex.bind(this);
    this.setColor = this.setColor.bind(this);
    this.readFile = this.readFile.bind(this);
  }


  handleChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicTiles;

    let hex = this.bytesToHex(this.state.color);
    const stackId = contract.methods["setColorBytes"].cacheSend(this.props.tileId, hex, {
      from: drizzleState.accounts[0]
    });

    this.setState({ stackId, hex });
  }

  bytesToHex(bytes) {
    let hex = '0x';
    hex += Array.from(bytes, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
    return hex;
  }


  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, update the color if success
    if (transactions[txHash] && transactions[txHash].status === 'success') {
      this.props.tilesObj.color = this.state.hex;
      this.setState({stackId: null});
      this.props.reload();
    } else if (transactions[txHash] && transactions[txHash].status === 'error') {
      this.setState({stackId: null});
    }
    return null;
  };

  updateColor = () => {
    if (this.state.color === '' || !this.state.imageDisplayed) {
      return;
    }
    let result = <div className="center">
      <button className="basic" type="button" onClick={() => this.handleSubmit()}>Update Color</button>
      <div>{this.getTxStatus()}</div>
      <br />
      <br />
    </div>;
    return result;
  }

  dataUrlFromInt8Array(int8array) {
    let uint = Uint8Array.from(int8array);
    let imgSrc = 'data:image/png;base64,';
    imgSrc += Base64.fromUint8Array(uint);
    return imgSrc;
  }

  displayColor = () => {
    if (this.state.color === '') {
      return;
    }

    let imgSrc = this.dataUrlFromInt8Array(this.state.color);

    let i = new Image();
    //TODO would be better to handle this with normal react jsx
    let picDiv = document.getElementById("pic");
    i.onload = () => {
      if (i.naturalWidth !== 16 || i.naturalHeight !== 16) {
        if (picDiv.hasChildNodes()) {
          picDiv.removeChild(picDiv.firstChild);
        }
        let error = document.createTextNode("Error, width and height must both be 16 px");
        picDiv.appendChild(error);
        this.setState({color : ''});

      } else {
        this.setState({imageDisplayed: true});
        picDiv.appendChild(i);

      }
    }
    i.src = imgSrc;
    if (picDiv.hasChildNodes()) {
      picDiv.removeChild(picDiv.firstChild);
    }
    // picDiv.appendChild(i);
    return;

  }

  readFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    const fileList = e.target.files;
    //Catch error if trying to cancel when uploading a second file
    if (!fileList || fileList.length === 0) {
      return;
    }
    console.log(fileList);
    reader.onload = async (e) => {
      const buffer = (e.target.result)
      let expectedColor = new Int8Array(buffer);

      this.setState({imageDisplayed: false});
      this.setState({ color: expectedColor});
    this.displayColor();
    };
    // reader.readAsDataURL(e.target.files[0])
    let file = e.target.files[0];
    reader.readAsArrayBuffer(file);

  }

  setColor() {
    if (!this.props.isMetaMask) {
      return;
    }
    //Check if clicked on new tile
    //TODO this gives a warning...
    if (this.state.tileId === '' || (this.state.tileId !== '' && this.state.tileId !== this.props.tileId)) {
      console.log("Clicked on new tile");
      this.setState({tileId: this.props.tileId, color: '', hex: '', stackId: null, imageDisplayed: false});
      let picDiv = document.getElementById("pic");
      if (picDiv && picDiv.hasChildNodes()) {
       picDiv.removeChild(picDiv.firstChild);
      }
    }
    if (!this.props.owner || !this.props.drizzleState.accounts || this.props.owner !== this.props.drizzleState.accounts[0]) {
      return;
    }

    return (
      <div>
        <div>
          <h2>Upload artwork</h2>
          <p>Please ensure it is a png and the size is 16x16px</p>
          <input type="file" id="file-selector" onChange={(e) => this.readFile(e)} />
        </div>
        <div id="pic">
          {/* {this.displayColor()} */}
        </div>
        <div>
          {this.updateColor()}
        </div>
      </div>
    );

  }

  render() {
    return (
      <div>
        {this.setColor()}
      </div>
    );
  }
}

export default SetColor;