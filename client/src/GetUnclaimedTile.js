import React from "react";
import './style/DisplayCanvas.css';

class GetUnclaimedTile extends React.Component {
  state = { stackId: null , tileId: ''};
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUnclaimedTile = this.getUnclaimedTile.bind(this);
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

    //If success update the owner, otherwise if error just reset the stack id
    if (transactions[txHash] && transactions[txHash].status === 'success') {
      this.props.tilesObj.owner = this.props.drizzleState.accounts[0];
      this.props.tilesObj.hasOwner = true;
      this.setState({stackId: null});
      this.props.reload();
    } else if (transactions[txHash] && transactions[txHash].status === 'error') {
      this.setState({stackId: null});
    }
    return null;
  };

  getUnclaimedTile = () => {
    if (!this.props.tilesObj || this.props.owner !== '0x0000000000000000000000000000000000000000') {
      return;
    }
    if (!this.props.isMetaMask) {
      return <div className="center">
        <p>Enable MetaMask to claim this tile!</p>
      </div>;
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