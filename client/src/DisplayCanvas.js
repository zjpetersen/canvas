import React from "react";
import DisplaySectionDetails from './DisplaySectionDetails';
import './style/DisplayCanvas.css';
import {Base64} from 'js-base64';
import loadingGif from './media/Spinner-1s-200px.gif';
import {convertToDataUrl} from './Utils';
import {fetchSections} from './HttpClient';

const WIDTH = 160;
const HEIGHT = 160;
const ROW_SIZE = 112; 
const COLUMN_SIZE = 63; 
const SECTION_SIZE = 16;
const SCALING_FACTOR = 1;
const ARR_LEN = ROW_SIZE * COLUMN_SIZE;
const PAGES = 56;


class DisplayCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.state = { sectionsArray: null, sections: null, canvas: null, currentSection: null, currentSectionId: null, sectionOffers: null};
    this.setCurrentSection = this.setCurrentSection.bind(this);
    this.getColor = this.getColor.bind(this);
    this.loading = this.loading.bind(this);

  }

  componentDidMount() {
    fetchSections(this, function (parent, data) {
      console.log("Update sections array");
      console.log(data);
      parent.setState({sectionsArray : data});
      console.log(parent.state);
    });
  }


  // fetchSections() {
  //   const canvasRef = this.props.drizzle.contracts.Canvas;
  //   const LENGTH = ARR_LEN / PAGES;

  //   let result = [];
  //   let cursor = 0;

  //   for (let i = 0; i < PAGES; i++) {
  //     let x = canvasRef.methods["fetchSections"].cacheCall(cursor, LENGTH);
  //     result = result.concat(x);
  //     cursor += LENGTH;
  //   }
  //   return result;
  // }

  setCurrentSection(i) {
    const { drizzle } = this.props;
    const canvas = drizzle.contracts.Canvas;

    // let drizzle know we want to call the `checkSection` method with `value`
    const section = canvas.methods["getSection"].cacheCall(i);
    const offerRef = canvas.methods["getOffersForSection"].cacheCall(i);
    this.setState({ currentSection: section, currentSectionId : i, sectionOffers: offerRef});
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getColor(section, i) {
      if (section.owner !== "0x0000000000000000000000000000000000000000") {
        return "#7d7d7d";
      } else {
        if (i % 10 === 0) {
          return "#8b658f";
        }
        return "#f2eac9";
      }
  }

  buildRow = (sections, start, end, ROW_SIZE) => {
    let x = start / ROW_SIZE;
    // console.log("building row: " + x);
    let row = [];
    for (let i = start; i < end; i++) {
      if (sections.length === i) {
        break;
      }
      let section = sections[i];
      let imgSrc = section.color;
      if (imgSrc.startsWith('0x') && imgSrc.length > 2) {
        imgSrc = convertToDataUrl(imgSrc);
      }
      if (imgSrc.startsWith("data:image")) {
        let image = <img id="canvasImg" src={imgSrc} alt="Section"/>
        row.push(<div id="canvasElement" key={i} onClick={() => this.setCurrentSection(i)}>{image}</div>);
      } else {
        let style = {
          backgroundColor: this.getColor(section, i),
          // border: "1px solid #383838"
        }
        row.push(<div id="canvasElement" key={i} style={style} onClick={() => this.setCurrentSection(i)} />);
      }

    }
    let rowId = "row" + (start / ROW_SIZE);
    return <div id="canvasRow" key={rowId} >{row}</div>;

  }
  
  loading = () => {
      return <div id="loading">
        <p>Loading the canvas...this will take a bit.</p>
        <img id="loading" src={loadingGif} alt="Loading"/>
      </div>;
  }

  buildCanvas = () => {
    // var d = new Date();
    // var n = d.getTime();

    const { Canvas } = this.props.drizzleState.contracts;
    if (!this.state.sectionsArray) {
      return this.loading();
    }
    // let sections = [];
    // for (let i = 0; i < PAGES; i++) {
    //   let x = Canvas.fetchSections[this.state.sectionsArray[i]];
    //   if (!x) { 
    //     return this.loading();
    //   }
    //   sections = sections.concat(x.value);
    // }
    // if (!sections) { 
    //   return this.loading();
    // }
    let sections = this.state.sectionsArray;

    let result = [];
    //Naive for loop, look to clean this up
    for (let i = 0; i < sections.length; i+=ROW_SIZE) {
        result.push(this.buildRow(sections, i, i+ROW_SIZE, ROW_SIZE));
    }

    // var d2 = new Date();
    // var n2 = d2.getTime();
    // console.log("buildCanvas time");
    // console.log(n2-n);
  
    return <div id="divCanvas">{result}</div>;
  }

  getHtmlCanvas = () => {
    let style={
      border: "1px solid #000000",
    };
    let result = <canvas id="myCanvas" width={WIDTH} height={HEIGHT} style={style} ></canvas>;
    return result;
  }

  render() {
    return (
      <div id="center">
        <h2>Canvas</h2>
        {/* <div id="divCanvas" >{this.buildCanvas()}</div> */}
        {this.buildCanvas()}
        {/* <h2>Canvas based:</h2>
        {this.getHtmlCanvas()}
        <div>{this.buildCanvas2()}</div> */}
        
        <DisplaySectionDetails
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
          currentSection={this.state.currentSection}
          sectionsObj = {this.state.sectionsArray}
          sectionId={this.state.currentSectionId}
          offerRef={this.state.sectionOffers}
        />

        {/* <EventListener
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        /> */}
      </div>
    );
  }
}

export default DisplayCanvas;