import React from "react";
import DisplaySectionDetails from './DisplaySectionDetails';
import './style/DisplayCanvas.css';
import {Base64} from 'js-base64';
import loadingGif from './media/Spinner-1s-200px.gif';

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
    this.state = { sectionsArray: null, sections: null, canvas: null, currentSection: null, currentSectionId: null};
    this.setCurrentSection = this.setCurrentSection.bind(this);
    this.convertToDataUrl = this.convertToDataUrl.bind(this);
    this.getColor = this.getColor.bind(this);
    this.fetchSections = this.fetchSections.bind(this);
    this.loading = this.loading.bind(this);

  }

  componentDidMount() {
    const sectionsArray = this.fetchSections();
    this.setState({sectionsArray: sectionsArray});
  }

  fetchSections() {
    const canvasRef = this.props.drizzle.contracts.Canvas;
    const LENGTH = ARR_LEN / PAGES;

    let result = [];
    let cursor = 0;

    for (let i = 0; i < PAGES; i++) {
      let x = canvasRef.methods["fetchSections"].cacheCall(cursor, LENGTH);
      result = result.concat(x);
      cursor += LENGTH;
    }
    return result;
  }

  setCurrentSection(i) {
    const { drizzle } = this.props;
    const canvas = drizzle.contracts.Canvas;

    // let drizzle know we want to call the `checkSection` method with `value`
    const section = canvas.methods["getSection"].cacheCall(i);
    this.setState({ currentSection: section, currentSectionId : i});
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
      let imgSrc = section.colorBytes;
      if (imgSrc.startsWith('0x') && imgSrc.length > 2) {
        imgSrc = this.convertToDataUrl(imgSrc);
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
    let sections = [];
    for (let i = 0; i < PAGES; i++) {
      let x = Canvas.fetchSections[this.state.sectionsArray[i]];
      if (!x) { 
        return this.loading();
      }
      sections = sections.concat(x.value);
    }
    if (!sections) { 
      return this.loading();
    }

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

  convertToDataUrl(color) {
    color = color.substr(2, color.length);
    let bytes = [];
    for (let c = 0; c < color.length; c += 2) {
      bytes.push(parseInt(color.substr(c, 2), 16));
    }
    let int8arr = Uint8Array.from(bytes);
    color = 'data:image/png;base64,';
    color += Base64.fromUint8Array(int8arr);
    return color;
  }

  colorImages = (row, col, pix, SECTION_SIZE, sections, sectionId, context) => {
    let section = sections.value[sectionId];
    let color = section.colorBytes;
    if (color.startsWith('0x') && color.length > 2) {
      color = this.convertToDataUrl(color);
    }

    if (color.startsWith("data:image")) {
      let img = new Image(); 
      //Need event listener to make sure image has loaded before we write it to the canvas
      img.addEventListener('load', function() {
        context.drawImage(img,col*SECTION_SIZE, row*SECTION_SIZE, SECTION_SIZE, SECTION_SIZE);
      }, false);
      img.src = color;
      return;
    }

  }
  colorPixels = (row, col, pix, SECTION_SIZE, ROW_SIZE, COLUMN_SIZE, sections, sectionId, context) => {
    //row=0, col=1 : pixelId = 16
    //row=2, col=0 : pixelId = 20480 (2*10*16*16*4)
    //row=2, col=1 : pixelId = 20608 (2*10*16*16*4 + 2*16*4)
    //Number of pixels in a row
    let section = sections.value[sectionId];
    let color = section.encodedColor ? section.encodedColor : "#00FF00"; //green
    if (sectionId === 0) {
      color = "#0000FF" //blue
    }
    if (color.startsWith("data:image")) {
      return;
    } else if (!color.startsWith("#")) {
      color = "#FF0000"; //red
    }
    let rgbColor = this.hexToRgb(color);
    const ROW_PIX = ROW_SIZE*SECTION_SIZE*4; //10*16*4=640
    //Number of pixels in a full row of sections. I.e First row of drawing takes this many pixels
    const FULL_ROW_PIX = ROW_PIX * SECTION_SIZE;
    let startingRowPix = row*FULL_ROW_PIX;
    let startingColPix = col*SECTION_SIZE*4;
    
    const PIXELS_TO_DRAW = SECTION_SIZE * SECTION_SIZE;
    const STARTING_PIX = startingRowPix + startingColPix;

    for (let pixId = STARTING_PIX, pixCount = 0; pixCount < PIXELS_TO_DRAW; ) {
      pix[pixId  ] = rgbColor['r']; // red
      pix[pixId+1] = rgbColor['g']; // green
      pix[pixId+2] = rgbColor['b']; // blue

      pixCount++;
      if (pixCount % SECTION_SIZE*4 === 0) {
        pixId += 4+ROW_PIX -  SECTION_SIZE*4;
        // console.log("New row");
      } else {
        pixId +=4;
      }
      // console.log(pixId);
    }


  }

  buildCanvas2 = () => {
    // var d = new Date();
    // var n = d.getTime();
    const { Canvas } = this.props.drizzleState.contracts;

    const sections = Canvas.getSections[this.state.sectionsArray];
    if (!sections) { return;}

    // let result = [];
    let canvas = document.getElementById("myCanvas");
    if (!canvas) {
      return;
    }
    let context = canvas.getContext("2d");
    // context.fillStyle = "#000000";
    context.fillRect(0,0, WIDTH*SCALING_FACTOR, HEIGHT*SCALING_FACTOR);

    let imgd = context.getImageData(0, 0, WIDTH*SCALING_FACTOR, HEIGHT*SCALING_FACTOR);
    let pix = imgd.data;
    // console.log(pix);
    let sectionId = 0;
    
    // for (let i = 0; i < ROW_SIZE; i++) {
    //   for (let j = 0; j < COLUMN_SIZE; j++, sectionId++) {
    //     this.colorPixels(i, j, pix, SECTION_SIZE*SCALING_FACTOR, ROW_SIZE, COLUMN_SIZE, sections, sectionId, context);
    //   }
    // }

    context.putImageData(imgd, 0,0);
    // context.imaageSmoothingEnabled = false;

    sectionId = 0;
    for (let i = 0; i < ROW_SIZE; i++) {
      for (let j = 0; j < COLUMN_SIZE; j++, sectionId++) {
        this.colorImages(i, j, pix, SECTION_SIZE*SCALING_FACTOR, sections, sectionId, context);
      }
    }

    // var d2 = new Date();
    // var n2 = d2.getTime();
    // console.log("buildCanvas2 time");
    // console.log(n2-n);
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
          sectionId={this.state.currentSectionId}
        />
      </div>
    );
  }
}

export default DisplayCanvas;