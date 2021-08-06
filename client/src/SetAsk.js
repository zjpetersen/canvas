import React from "react";
import './style/SetColor.css';
import './style/Alert.css';
import './style/DisplayCanvas.css';
import Web3 from "web3";

class SetAsk extends React.Component {

  constructor(props) {
    super(props);
    this.state = { amount: '', stackId: null, imageDisplayed: false, hex: '', tx: null };
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAsk = this.updateAsk.bind(this);
  }

  handleChangeAmount(event) {
      console.log("Setting new amount: " + event.target.value);
    this.setState({amount: event.target.value });
      console.log("Set new amount: " + this.state.amount);
  }

  handleRemoveSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicMarket;
    console.log("Removing ask");
    const stackId = contract.methods["removeAsk"].cacheSend(this.props.tileId, {
      from: drizzleState.accounts[0]
    });

    this.setState({ stackId: stackId, amount: '' });
  }

  handleSubmit(event) {
      event.preventDefault();
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MosaicMarket;
    console.log("Submitting number" + this.state.amount);
    let amount = Web3.utils.toWei(this.state.amount);
    console.log(amount);
    const stackId = contract.methods["ask"].cacheSend(this.props.tileId, amount, {
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

    //TODO transactions isn't working
    console.log(transactionStack);
      console.log(this.props.drizzleState);
      console.log(txHash);
    //   if (transactions[txHash] && transactions[txHash].status === 'Success') {

          if (this.state.amount !== '') {
              let offer = this.props.highestOffer;
              if (offer && offer.amount !== '0' && offer.amount >= Web3.utils.toWei(this.state.amount)) {
                  this.props.tilesObj.ask = '0';
                  this.props.tilesObj.owner = offer.offerer;
              } else {
                  this.props.tilesObj.ask = Web3.utils.toWei(this.state.amount);
              }
          } else {
              this.props.tilesObj.ask = '0';
          }
    //   }

    // otherwise, return the transaction status
    let msg = `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    this.setState({stackId: null, tileId: '', amount: '', tx: transactions[txHash]});
    return msg;
  };

  updateAsk = () => {
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

  setAsk() {
    if (!this.props.owner || !this.props.drizzleState.accounts || this.props.owner !== this.props.drizzleState.accounts[0]) {
      return;
    }

    return (
      <div>
        <div>
          <h2>Set ask</h2>
          <p>If there is an offer above the ask amount, then the offer will be automatically accepted.</p>
          {this.updateAsk()}
        </div>
      </div>
    );
  }

  removeAsk() {
    if (!this.props.owner || !this.props.ask || this.props.ask === '0' || !this.props.drizzleState.accounts || this.props.owner !== this.props.drizzleState.accounts[0]) {
      return;
    }

    return (
      <div>
        <div>
          <button className="basic" type="button" onClick={() => this.handleRemoveSubmit()}>Remove Ask</button>
        </div>
      </div>
    );

  }

  render() {
    return (
      <div>
        {this.setAsk()}
        {this.removeAsk()}
      </div>
    );
  }
}

export default SetAsk;