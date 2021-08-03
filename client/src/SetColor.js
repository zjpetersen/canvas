import React from "react";
import {Base64} from 'js-base64';
import './style/SetColor.css';
import './style/Alert.css';
import './style/DisplayCanvas.css';

class SetColor extends React.Component {

  constructor(props) {
    super(props);
    this.state = { sectionId: '', color: '', stackId: null, imageDisplayed: false, hex: '' };
    this.handleChangeSectionId = this.handleChangeSectionId.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayColor = this.displayColor.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.dataUrlFromInt8Array = this.dataUrlFromInt8Array.bind(this);
    this.bytesToHex = this.bytesToHex.bind(this);
    this.setColor = this.setColor.bind(this);
    this.readFile = this.readFile.bind(this);
    // this.bytesToBase64 = this.bytesToBase64.bind(this);
  }

  handleChangeSectionId(event) {
    this.setState({ sectionId: event.target.value });
  }

  handleChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicMarket;

    let hex = this.bytesToHex(this.state.color);
    const stackId = contract.methods["setColorBytes"].cacheSend(this.props.sectionId, hex, {
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
    this.props.sectionsObj.color = this.state.hex;
    this.props.sectionsObj.updatedColor = true;

    // otherwise, return the transaction status
    let msg = `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    this.setState({stackId: null, sectionId: ''});
    return msg;
  };

  updateColor = () => {
    if (this.state.color === '') {
      return;
    }
    let result = <div className="center">
      <button className="basic" type="button" onClick={() => this.handleSubmit()}>Update Color</button>
      {/* <form onSubmit={this.handleSubmit}>
        <label> Section id:
                <input
            name="sectionId"
            type="text"
            value={this.state.sectionId}
            onChange={this.handleChangeSectionId} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form> */}
      <div>{this.getTxStatus()}</div>
      <br />
      <br />
    </div>;
    return result;
  }

  // bytesToBase64(bytes) {
  //   let binary = '';
  //   let len = bytes.byteLength;
  //   for (var i = 0; i < len; i++) {
  //       binary += String.fromCharCode( bytes[ i ] );
  //   }
  //   console.log(binary);
  //   let result = Base64.encode(binary);
  //   //TODO fix encoding issue
  //   console.log(result);
  //   return Base64.encode(binary);
  //   // return window.btoa(binary);
  // }

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
    i.onload = function() {
      console.log(i.naturalWidth);
      if (i.naturalWidth !== 16 || i.naturalHeight !== 16) {
        //TODO handle error
        console.log("Error, width and height must both be 16 px");
        // this.setState({color : ''});
        // return <div class="alert">
        //     <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        //     <strong>Error:</strong> Width and height must both be 16 pixels.
        //   </div>;
      }
    }
    i.src = imgSrc;
    let picDiv = document.getElementById("pic");
    console.log(picDiv);
    picDiv.appendChild(i);
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
      // let x;
      // for (let i = 0; i < expectedColor.length; i++) {
      //   x += expectedColor[i] + ",";
      // }
      // console.log(x);
      // console.log(expectedColor);
      this.setState({ color: expectedColor});
    this.displayColor();
    };
    // reader.readAsDataURL(e.target.files[0])
    console.log(e.target);
    let file = e.target.files[0];
    console.log(file);
    reader.readAsArrayBuffer(file);

  }

  setColor() {
    if (!this.props.owner || this.props.updatedColor || !this.props.drizzleState.accounts || this.props.owner !== this.props.drizzleState.accounts[0]) {
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