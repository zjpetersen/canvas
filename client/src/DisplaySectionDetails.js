import React from "react";
import GetUnclaimedSection from "./GetUnclaimedSection";
import SetColor from "./SetColor";

class DisplaySectionDetails extends React.Component {
  state = { section: null, sectionId: null, canvas: null};

  getSectionDetails = () => {
    if (!this.props.currentSection || !this.props.sectionId) {return (<div>
      <p>No section selected</p>
      </div>
      );
    }

    const { Canvas } = this.props.drizzleState.contracts;
    const section = Canvas.getSection[this.props.currentSection];
    console.log(this.props.currentSection);
    
      return (
        <div>
          <div className="center">
            <p>Section details</p>
            <p>Owner: {section && section.value.owner}</p>
            <p>Color: {section && section.value.encodedColor}</p>
            <p>Color Bytes: {section && section.value.colorBytes}</p>
            <p>Offer: {section && section.value.offer}</p>
          </div>
          <GetUnclaimedSection
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value.owner}
          />
          <SetColor
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value.owner}
            updatedColor={section && section.value.updatedColor}
          />

        </div>
      );
  }

  render() {
    return (
      <div>
        <div>{this.getSectionDetails()}</div>
      </div>
    );
  }
}

export default DisplaySectionDetails;