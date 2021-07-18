import React from "react";
import './style/DisplayCanvas.css';

class GetUnclaimedSection extends React.Component {
  state = { stackId: null , sectionId: ''};
  constructor(props) {
    super(props);
    this.handleChangeSectionId = this.handleChangeSectionId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUnclaimedSection = this.getUnclaimedSection.bind(this);
  }

  handleChangeSectionId(event) {
      this.setState({sectionId: this.props.sectionId});
  }

  handleSubmit(event) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Canvas;
    const stackId = contract.methods["getSectionForFree"].cacheSend(this.props.sectionId, {
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
    this.props.sectionsObj.owner = this.props.drizzleState.accounts[0];
    this.props.sectionsObj.hasOwner = true;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

  getUnclaimedSection = () => {
    if (!this.props.sectionId || this.props.owner !== '0x0000000000000000000000000000000000000000') {
      return;
    }

    return <div className="center">
      <button className="basic" type="button" onClick={this.handleSubmit}>Claim Section</button>
      <div>{this.getTxStatus()}</div>
      {/* <br />
      <br /> */}
    </div>;


  }

  render() {
    return (
        <div>
          {this.getUnclaimedSection()}
        </div>
    );
  }
}

export default GetUnclaimedSection;