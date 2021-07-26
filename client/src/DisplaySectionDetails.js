import React from "react";
import Web3 from "web3";
import GetUnclaimedSection from "./GetUnclaimedSection";
import SetColor from "./SetColor";
import SetAsk from "./SetAsk";
import SetOffer from "./SetOffer";
import {convertToDataUrl} from './Utils';

class DisplaySectionDetails extends React.Component {
  state = { section: null, sectionId: null, canvas: null, offerRef: null};

  getOwner = (section) => {
    if (section) {
      if (section.owner !== '0x0000000000000000000000000000000000000000') {
        return <p>Owner: {section && section.owner}</p>;
      } else {
        return <p>No owner, claim the section now</p>
      }
    }
    return;
  }

  getPicture = (section) => {
    if (section) {
      let imgSrc = section.color;
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
    if (section) {
      if (section.ask !== '0') {
        return <p>Ask: {section && Web3.utils.fromWei(section.ask)}</p>;
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
        return <p>Highest offer: {Web3.utils.fromWei(highestOffer.amount)} ether</p>
      } else {
        return <p>No offers yet.</p>
      }
    }
    return;
  }

  getSectionDetails = () => {
    if (!this.props.currentSection || !this.props.sectionId || !this.props.offerRef || !this.props.sectionsObj) {
      return;
    }

    const { Canvas } = this.props.drizzleState.contracts;
    const section = Canvas.getSection[this.props.currentSection];
    const offers = Canvas.getOffersForSection[this.props.offerRef];
    const secObj = this.props.sectionsObj[this.props.sectionId];
    
      return (
        <div>
          <div className="center">
            <p>Section details for section {this.props.sectionId}</p>
            {this.getPicture(secObj)}
            {this.getOwner(secObj)}
            {this.getAsk(secObj)}
            {this.getOffer(offers)}
          </div>
          <GetUnclaimedSection
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value && section.value.owner}
            sectionsObj={this.props.sectionsObj[this.props.sectionId]}
          />
          <SetOffer
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value && section.value.owner}
            ask={section && section.value && section.value.ask}
            sectionsObj={secObj}
          />
          <SetColor
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value && section.value.owner}
            updatedColor={section && section.value && section.value.updatedColor}
            sectionsObj={secObj}
          />
          <SetAsk
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            sectionId={this.props.sectionId}
            owner={section && section.value && section.value.owner}
            ask={section && section.value && section.value.ask}
            sectionsObj={secObj}
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