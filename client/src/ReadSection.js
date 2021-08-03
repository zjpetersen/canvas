import React from "react";

class ReadSection extends React.Component {
  state = { color : null};

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const canvas = drizzle.contracts.MosaicMarket;
    
    //Watch the 'getColor' method
    const color = canvas.methods["getColor"].cacheCall(10);
    // const stackId = contract.methods["set"].cacheSend(value, {
    //   from: drizzleState.accounts[0]
    // });

    // save the 'color' to local component state for later reference
    this.setState({color});
    console.log(drizzle);
    console.log(drizzleState);
  }

  render() {
    // get the contract state from drizzleState
    const { MosaicMarket} = this.props.drizzleState.contracts;

    // using the saved `color`, get the variable we're interested in
    const color = MosaicMarket.getColor[this.state.color];

    // if it exists, then we display its value
    // return <p>My stored color: {color && color.value}</p>;
    return <p>My stored color: {color && color.value}</p>;
    // return <div>ReadString Component</div>;
  }
}

export default ReadSection;