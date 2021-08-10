import React from "react";
import './style/SetColor.css';
import './style/Alert.css';
import './style/DisplayCanvas.css';
import Web3 from "web3";

class SetOffer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { amount: '', stackId: null, imageDisplayed: false, hex: '' };
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateOffer = this.updateOffer.bind(this);
  }

  handleChangeAmount(event) {
      console.log("Setting new amount: " + event.target.value);
    this.setState({amount: event.target.value });
      console.log("Set new amount: " + this.state.amount);
  }

  handleRemoveSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicTiles;
    console.log("Removing offer");
    const stackId = contract.methods["removeOffer"].cacheSend(this.props.tileId, {
      from: drizzleState.accounts[0]
    });

    this.setState({ stackId: stackId, amount: '' });
  }

  handleSubmit(event) {
      event.preventDefault();
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicTiles;
    console.log("Submitting number" + this.state.amount);
    let amount = Web3.utils.toWei(this.state.amount);
    console.log(amount);
    //TODO more testing to check for nonce error
    const stackId = contract.methods["offer"].cacheSend(this.props.tileId, {
      from: drizzleState.accounts[0],
      value: amount
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

    //TODO if the owner changes, need to update the ask to has not been set
      if (this.state.amount !== '') {
          let ask = this.props.tilesObj.ask;
          if (ask && ask !== '' && ask === Web3.utils.toWei(this.state.amount)) {
              this.props.tilesObj.ask = '0';
              this.props.tilesObj.owner = this.props.drizzleState.accounts[0];
          }
      } 

    // otherwise, return the transaction status
    let msg = `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    this.setState({stackId: null, tileId: '', amount: ''});
    return msg;
  };

  updateOffer = () => {
    let result = <div className="center">
      <form onSubmit={(event) => this.handleSubmit(event)}>
        <label> Amount:
                <input
            name="amount"
            type="number"
            step=".001"
            min="0"
            value={this.state.amount}
            onChange={(event) => this.handleChangeAmount(event)} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <div>{this.getTxStatus()}</div>
      <br />
      <br />
    </div>;
    return result;
  }

  setOffer() {
    if (!this.props.owner || !this.props.drizzleState.accounts || this.props.owner === this.props.drizzleState.accounts[0] || this.props.owner === '0x0000000000000000000000000000000000000000') {
      return;
    }

    return (
      <div>
        <div>
          <h2>Set offer</h2>
          <p>If there is an ask equal to the offer amount, then the offer will be automatically accepted.</p>
          {this.updateOffer()}
        </div>
      </div>
    );
  }

  removeOffer() {
    if (!this.props.owner || !this.props.drizzleState.accounts || this.props.owner === this.props.drizzleState.accounts[0] || this.props.owner === '0x0000000000000000000000000000000000000000') {
      return;
    }

    return (
      <div>
        <div>
          <button className="basic" type="button" onClick={() => this.handleRemoveSubmit()}>Remove Offer</button>
        </div>
      </div>
    );

  }

  render() {
    return (
      <div>
        {this.setOffer()}
        {this.removeOffer()}
      </div>
    );
  }
}

export default SetOffer;