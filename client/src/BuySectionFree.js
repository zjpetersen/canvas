
import React from "react";

class BuySectionFree extends React.Component {
  state = { stackId: null , sectionId: ''};
  constructor(props) {
    super(props);
    this.handleChangeSectionId = this.handleChangeSectionId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSectionId(event) {
      this.setState({sectionId: event.target.value});
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Canvas;
    const stackId = contract.methods["getSectionForFree"].cacheSend(this.state.sectionId, {
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

  render() {
    return (
        <div>
          <p>Get free section: </p>
          <form onSubmit={this.handleSubmit}>
            <label>Section id:
              <input
                name="sectionId"
                type="text"
                value={this.state.sectionId}
                onChange={this.handleChangeSectionId} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div>{this.getTxStatus()}</div>
          <br/>
          <br/>
        </div>
    );
  }
}
/*

    return (
        <div>
            <p>Update color: </p>
      <form onSubmit={this.handleSubmit}>
        <label>
          Section id:
          <input
            name="sectionId"
            type="text"
            value={this.state.sectionId}
            onChange={this.handleChangeSectionId} />
        </label>
        <br />
        <label>
          Color:
          <input
            name="color"
            type="text"
            value={this.state.color}
            onChange={this.handleChangeColor} />
        </label>
        <input type="submit" value="Submit" />
      </form>
        <div>{this.getTxStatus()}</div>
      </div>
    );
*/

export default BuySectionFree;