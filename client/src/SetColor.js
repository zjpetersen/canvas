import React from "react";
import './style/SetColor.css';

class SetColor extends React.Component {

  constructor(props) {
    super(props);
    this.state = { sectionId: '', color: '', stackId: null };
    this.handleChangeSectionId = this.handleChangeSectionId.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayColor = this.displayColor.bind(this);
    this.updateColor = this.updateColor.bind(this);
  }

  handleChangeSectionId(event) {
    this.setState({ sectionId: event.target.value });
  }

  handleChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Canvas;
    const stackId = contract.methods["setColor"].cacheSend(this.state.sectionId, this.state.color, {
      from: drizzleState.accounts[0]
    });

    this.setState({ stackId });

  }

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

  updateColor = () => {
    if (this.state.color === '') {
      return;
    }
    let result = <div><p>Update color: </p>
      <form onSubmit={this.handleSubmit}>
        <label> Section id:
                <input
            name="sectionId"
            type="text"
            value={this.state.sectionId}
            onChange={this.handleChangeSectionId} />
        </label>
        <br />
        {/* <label> Color:
                <input
                name="color"
                type="text"
                value={this.state.color}
                onChange={this.handleChangeColor} />
            </label> */}
        <input type="submit" value="Submit" />
      </form>
      <div>{this.getTxStatus}</div>
      <br />
      <br />
    </div>;
    return result;
  }

  displayColor = () => {
    if (this.state.color === '') {
      return;
    }
    console.log(this.state.color);

    let img = <img src={this.state.color} alt="Uploaded" width="16" height="16" />
    return img;

  }

  readFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    const fileList = e.target.files;
    console.log(fileList);
    reader.onload = async (e) => {
      //TODO error handling
      const dataUrl = (e.target.result)
      //TODO use compression algo to save space
      this.setState({ color: dataUrl });
      console.log(this.state.color);
    };
    reader.readAsDataURL(e.target.files[0])
    // reader.readAsArrayBuffer(e.target.files[0])

  }

  render() {
    return (
      <div>
        <div>
          <h2>Upload artwork</h2>
          <p>Please ensure it is a png and the size is 16x16px</p>
          <input type="file" id="file-selector" onChange={(e) => this.readFile(e)} />
        </div>
        <div id="pic">
          {this.displayColor()}
        </div>
        <div>
          {this.updateColor()}
        </div>
      </div>
    );
  }
}

export default SetColor;