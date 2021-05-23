import React from "react";

class DisplaySectionDetails extends React.Component {
  state = { section: null, sectionId: '', canvas: null};

  handleKeyDown = e => {
    // if the enter key is pressed, set the value with the string
    if (e.keyCode === 13) {
      this.setValue(e.target.value);
    }
  };

  setValue = value => {
    const { drizzle } = this.props;
    const canvas = drizzle.contracts.Canvas;

    // let drizzle know we want to call the `checkSection` method with `value`
    const section = canvas.methods["checkSection"].cacheCall(value);
    this.setState({ section, value, canvas});
  };

  getSectionDetails = () => {
    if (!this.state.section) {return null;}

    const { Canvas } = this.props.drizzleState.contracts;

    const section = Canvas.checkSection[this.state.section];

      return (<div>
        <p>Section details</p> 
          <p>Owner: {section && section.value.owner}</p>
          <p>Color: {section && section.value.encodedColor}</p>
          <p>Offer: {section && section.value.offer}</p>
        </div>
      );
  }

  render() {
    return (
      <div>
        <input type="text" onKeyDown={this.handleKeyDown} />
        <div>{this.getSectionDetails()}</div>
        <br/>
        <br/>
      </div>
    );
  }
}

export default DisplaySectionDetails;