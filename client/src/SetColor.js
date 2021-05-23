import React from "react";

class SetColor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {sectionId: '', color: '', stackId: null };
    this.handleChangeSectionId = this.handleChangeSectionId.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSectionId(event) {
      this.setState({sectionId: event.target.value});
  }
  
  handleChangeColor(event) {
      this.setState({color: event.target.value});
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Canvas;
    alert("Submitted sectionId: " + this.state.sectionId + ", color: " + this.state.color);
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

  render() {
    return (
        <div>
            <p>Update color: </p>
            <form onSubmit={this.handleSubmit}>
                <label> Section id:
                <input
                        name="sectionId"
                        type="text"
                        value={this.state.sectionId}
                        onChange={this.handleChangeSectionId} />
                </label>
                <br />
                <label> Color:
                <input
                        name="color"
                        type="text"
                        value={this.state.color}
                        onChange={this.handleChangeColor} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <div>{this.getTxStatus()}</div>
            <br />
            <br />
        </div>
    );
  }
}

export default SetColor;