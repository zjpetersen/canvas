import React from "react";
import './style/DisplayCanvas.css';

class GetUnclaimedTile extends React.Component {
  state = { stackId: null , tileId: ''};
  constructor(props) {
    super(props);
    this.handleChangeTileId = this.handleChangeTileId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUnclaimedTile = this.getUnclaimedTile.bind(this);
  }

  handleChangeTileId(event) {
      this.setState({tileId: this.props.tileId});
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicTiles;
    console.log(contract);
    const stackId = contract.methods["mintTile"].cacheSend(this.props.tileId, {
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
    this.props.tilesObj.owner = this.props.drizzleState.accounts[0];
    this.props.tilesObj.hasOwner = true;

    // otherwise, return the transaction status
    let msg = `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    this.setState({stackId: null, tileId: ''});
    return msg;
  };

  getUnclaimedTile = () => {
    if (!this.props.tilesObj || this.props.owner !== '0x0000000000000000000000000000000000000000') {
      return;
    }

    return <div className="center">
      <button className="basic" type="button" onClick={this.handleSubmit}>Claim Tile</button>
      <div>{this.getTxStatus()}</div>
    </div>;


  }

  render() {
    return (
        <div>
          {this.getUnclaimedTile()}
        </div>
    );
  }
}

export default GetUnclaimedTile;