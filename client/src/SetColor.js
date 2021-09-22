import React from "react";
import {Base64} from 'js-base64';
import './style/SetColor.css';
import './style/Alert.css';
import './style/DisplayCanvas.css';

class SetColor extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tileId: '', color: '', stackId: null, imageDisplayed: false, hex: '', isBulkMode: false, fileNames: [], tileIds: '', tileIdsPending: '' };
    // this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayColor = this.displayColor.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.getTxStatus = this.getTxStatus.bind(this);
    this.dataUrlFromInt8Array = this.dataUrlFromInt8Array.bind(this);
    this.bytesToHex = this.bytesToHex.bind(this);
    this.setColor = this.setColor.bind(this);
    this.readFile = this.readFile.bind(this);
  }


  // handleChangeColor(event) {
  //   this.setState({ color: event.target.value });
  // }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.CryptoCanvas;

    let hex = this.bytesToHex(this.state.color[0]);
    console.log(hex);
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
      this.removeUploadedPic();
      this.setState({stackId: null});
      this.props.reload();
    } else if (transactions[txHash] && transactions[txHash].status === 'error') {
      this.removeUploadedPic();
      this.setState({stackId: null});
    }

    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

  updateColor = () => {
    if (this.state.color === '' || !this.state.imageDisplayed) {
      return;
    }
    let result = <div className="center">
      <button className="basic" type="button" onClick={() => this.handleSubmit()}>Submit Artwork</button>
      <div>{this.getTxStatus()}</div>
      <br />
      <br />
    </div>;
    return result;
  }

  updateColorBulk = () => {
    if (this.state.color === '' || !this.state.isBulkMode) {
      return;
    }
    return <div className="center">
      <form onSubmit={(event) => this.handleUpdateColorBulkSubmit(event)}>
        <label> Submit artwork. Specify tiles as a comma separated list:
                <input
            value={this.state.amount}
            onChange={(event) => this.handleUpdateColorBulkChange(event)} />
        </label>
        <input className="margin" type="submit" value="Submit" />
      </form>
    </div>

  }

  handleUpdateColorBulkChange(event) {
    this.setState({tileIdsPending: event.target.value });
  }

  handleUpdateColorBulkSubmit(event) {
      event.preventDefault();
    if (!this.state.isBulkMode || this.state.fileNames < 2) {
      //TODO should return error message to indicate needs more files.
      console.log("should return error message to indicate needs more files");
      return;
    }
      let tileIdsPending = this.state.tileIdsPending;
      if (typeof tileIdsPending !== 'string') {
        console.log("Input not a string");
        return;
      }

      let tileIdsArray = tileIdsPending.split(',');
      if (tileIdsArray.length !== this.state.fileNames.length) {
        console.log("File length and tileId lengths much match");
        return;
      }
      let tileIds = [];
      for (let i = 0; i < tileIdsArray.length; i++) {
        let id = parseInt(tileIdsArray[i]);
        if (!Number.isInteger(id)) {
          console.log("Input must all be integers");
          return;
        }
        tileIds.push(id);
      }

      let hexArray = [];
      for (let i = 0; i < this.state.color.length; i++) {
        let hex = this.bytesToHex(this.state.color[i]);
        hexArray.push(hex);
      }


      //Submit bulk colors to contract
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.CryptoCanvas;

    const stackId = contract.methods["setColorBytesBulk"].cacheSend(tileIds, hexArray, {
      from: drizzleState.accounts[0]
    });

    //TODO: Indicate that upload succeeded and update canvas.

    // this.setState({ stackId, hex });
    
  }

  dataUrlFromInt8Array(int8array) {
    let uint = Uint8Array.from(int8array);
    let imgSrc = 'data:image/png;base64,';
    imgSrc += Base64.fromUint8Array(uint);
    return imgSrc;
  }

  displayBulkColor = () => {
    if (this.state.color === '' || !this.state.isBulkMode) {
      return;
    }
    let bulkError;
    if (this.state.bulkError) {
      bulkError = <div style={{color:"red"}}>Error, width and height must both be 16 px, please reupload another image.</div>
    }
    let count = this.state.color.length;
    let fileRows = [];
    let fileNames = this.state.fileNames;
    for (let i = 0; i < fileNames.length; i++) {
      let row = <div key={i}>Uploaded file: {fileNames[i]}, position: {i+1}</div>;
      fileRows.push(row);

    }
    return <div>
            <p>Uploaded {count} artworks</p>
            {fileRows}
            {bulkError}
          </div>
  }

  validateColor = (expectedColor) => {
    if (!expectedColor) {
      return;
    }

    let imgSrc = this.dataUrlFromInt8Array(expectedColor);

    let i = new Image();
    i.onload = () => {
      //If invalid size, then display message and remove
      if (i.naturalWidth !== 16 || i.naturalHeight !== 16) {
        this.state.color.pop();
        this.state.fileNames.pop();
        this.setState({bulkError: true})
      } 
    }
    i.src = imgSrc;
    return;

  }

  displayColor = () => {
    if (this.state.color === '') {
      return;
    }

    let imgSrc = this.dataUrlFromInt8Array(this.state.color[0]);

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
    // e.preventDefault()
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

      if (this.state.isBulkMode) {
        let newColor = this.state.color;
        if (newColor !== '') {
          newColor.push(expectedColor);
        } else {
          newColor = [expectedColor];
        }
        this.setState({ imageDisplayed: false });
        this.setState({ color: newColor, bulkError: false });
        this.validateColor(expectedColor);
      } else {
        this.setState({ imageDisplayed: false });
        this.setState({ color: [expectedColor] });
        this.displayColor();
      }
    };
    // reader.readAsDataURL(e.target.files[0])
    let file = e.target.files[0];
    let newFileNames = this.state.fileNames;
    newFileNames.push(file.name);
    this.setState({fileNames: newFileNames});
    reader.readAsArrayBuffer(file);
    let uploadedFiles = document.getElementById("file-selector");
    if (uploadedFiles) {
      uploadedFiles.value = "";
    }

  }


  toggleBulkMode(event) {
    this.setState({isBulkMode: !this.state.isBulkMode});
  }

  colorInput() {
    let msg = !this.state.isBulkMode ? "Toggle To Bulk Update Mode" : "Toggle To Single Update Mode";
    let bulkWarning = !this.state.isBulkMode ? "" : "Warning, the bulk upload feature is still experimental!";
    return <div>
      <button className="small" type="button" onClick={() => this.toggleBulkMode()}>{msg}</button>
      <br></br>
      <br></br>
      <input type="file" id="file-selector" onChange={(e) => this.readFile(e)} />
      <p style={{ color: "red" }}>{bulkWarning}</p>
    </div>

  }

  removeUploadedPic() {
      this.setState({tileId: this.props.tileId, color: '', hex: '', stackId: null, imageDisplayed: false});
      let picDiv = document.getElementById("pic");
      if (picDiv && picDiv.hasChildNodes()) {
       picDiv.removeChild(picDiv.firstChild);
      }
      let uploadedFiles = document.getElementById("file-selector");
      if (uploadedFiles) {
        uploadedFiles.value="";
      }

  }

  setColor() {
    if (!this.props.isMetaMask) {
      return;
    }
    //Check if clicked on new tile
    //TODO this gives a warning...
    if (this.state.tileId === '' || (this.state.tileId !== '' && this.state.tileId !== this.props.tileId)) {
      console.log("Clicked on new tile");
      this.removeUploadedPic();
    }
    if (!this.props.owner || !this.props.drizzleState.accounts || this.props.owner !== this.props.drizzleState.accounts[0]) {
      return;
    }

    return (
      <div>
        <div>
          <h2>Upload artwork</h2>
          <p>Please ensure it is a png and the size is 16x16px</p>
          <div>
            {this.colorInput()}
          </div>
        </div>
        <div id="pic">
          {/* {this.displayColor()} */}
        </div>
        <div>
          {this.updateColor()}
        </div>
        <div>
          {this.displayBulkColor()}
          {this.updateColorBulk()}
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