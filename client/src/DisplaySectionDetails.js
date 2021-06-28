import React from "react";
import GetUnclaimedSection from "./GetUnclaimedSection";
import SetColor from "./SetColor";
import {convertToDataUrl} from './Utils';

class DisplaySectionDetails extends React.Component {
  state = { section: null, sectionId: null, canvas: null, offerRef: null};

  getOwner = (section) => {
    if (section && section.value) {
      if (section.value.owner !== '0x0000000000000000000000000000000000000000') {
        return <p>Owner: {section && section.value && section.value.owner}</p>;
      } else {
        return <p>No owner, claim the section now</p>
      }
    }
    return;
  }

  getPicture = (section) => {
    if (section && section.value) {
      let imgSrc = section.value.colorBytes;
      if (imgSrc.startsWith('0x') && imgSrc.length > 2) {
        imgSrc = convertToDataUrl(imgSrc);
      }
      if (imgSrc.startsWith("data:image")) {
        return <img id="detailedImg" src={imgSrc} alt="Section"/>;
      }
    }
    return;
  }

  getAsk = (section) => {
    if (section && section.value) {
      if (section.value.ask !== '0') {
        return <p>Ask: {section && section.value && section.value.ask}</p>;
      } else {
        return <p>No ask has been set.</p>
      }
    }
    return;
  }

  getOffer = (offers) => {
    if (offers && offers.value) {
      let highestOffer = { amount: '0', offerer: '0x' };
      for (let i = 0; i < offers.value.length; i++) {
        if (highestOffer.amount < offers.value[i].amount) {
          highestOffer = offers.value[i];
        }
      }
      if (highestOffer.amount !== '0') {
        return <p>Highest offer: {highestOffer.amount} wei</p>
      } else {
        return <p>No offers yet.</p>
      }
    }
    return;
  }

  getSectionDetails = () => {
    if (!this.props.currentSection || !this.props.sectionId || !this.props.offerRef) {
      return;
    }

    const { Canvas } = this.props.drizzleState.contracts;
    const section = Canvas.getSection[this.props.currentSection];
    const offers = Canvas.getOffersForSection[this.props.offerRef];
    // console.log(this.props.sectionId);
    
      return (
        <div>
          <div className="center">
            <p>Section details for section {this.props.sectionId}</p>
            {this.getPicture(section)}
            {this.getOwner(section)}
            {this.getAsk(section)}
            {this.getOffer(offers)}
          </div>
          <GetUnclaimedSection
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value && section.value.owner}
          />
          <SetColor
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value && section.value.owner}
            updatedColor={section && section.value && section.value.updatedColor}
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