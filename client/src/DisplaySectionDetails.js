import React from "react";

class DisplaySectionDetails extends React.Component {
  state = { section: null, sectionId: null, canvas: null};

  getSectionDetails = () => {
    if (!this.props.currentSection) {return (<div>
      <p>No section selected</p>
      </div>
      );
    }

    const { Canvas } = this.props.drizzleState.contracts;
    const section = Canvas.getSection[this.props.currentSection];
    
      return (<div>
        <p>Section details</p> 
          <p>Owner: {section && section.value.owner}</p>
          <p>Color: {section && section.value.encodedColor}</p>
          <p>Color Bytes: {section && section.value.colorBytes}</p>
          <p>Offer: {section && section.value.offer}</p>
        </div>
      );
  }

  render() {
    return (
      <div>
        <div>{this.getSectionDetails()}</div>
        <br/>
        <br/>
      </div>
    );
  }
}

export default DisplaySectionDetails;