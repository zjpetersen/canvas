import React from "react";
import DisplaySectionDetails from './DisplaySectionDetails';
import './style/DisplayCanvas.css';
import {Base64} from 'js-base64';

const WIDTH = 160;
const HEIGHT = 160;
const ROW_SIZE = 10;
const COLUMN_SIZE = 10;
const SECTION_SIZE = 16;
const SCALING_FACTOR = 1;


class DisplayCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.state = { sectionsArray: null, sections: null, canvas: null, currentSection: null};
    this.setCurrentSection = this.setCurrentSection.bind(this);
    this.convertToDataUrl = this.convertToDataUrl.bind(this);
  }

  componentDidMount() {
    const canvasRef = this.props.drizzle.contracts.Canvas;
    const sectionsArray = canvasRef.methods["getSections"].cacheCall();
    this.setState({sectionsArray: sectionsArray});
  }

  setCurrentSection(i) {
    const { drizzle } = this.props;
    const canvas = drizzle.contracts.Canvas;

    // let drizzle know we want to call the `checkSection` method with `value`
    const section = canvas.methods["getSection"].cacheCall(i);
    this.setState({ currentSection: section});
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  buildRow = (sections, start, end, ROW_SIZE) => {
     let row = [];
     for (let i = start; i < end; i++) {
         if (sections.value.length === i) {
             break;
         }
        let section = sections.value[i];
        let color = section.encodedColor ? section.encodedColor : "green";
        let style = {
            backgroundColor: color,
            height: "34px",
            width: "34px",
            float: "left"
        };
        row.push(<div key={i} style={style} onClick={() => this.setCurrentSection(i) }/>);
     }
        const styleRow = {
            clear: "both",
            content: "",
            display: "table",
        };
        let rowId = "row" + (start / ROW_SIZE);
     return <div key={rowId} style={styleRow}>{row}<br></br></div>;

  }

  buildCanvas = () => {
    const { Canvas } = this.props.drizzleState.contracts;

    const sections = Canvas.getSections[this.state.sectionsArray];
    if (!sections) { return;}

    let result = [];
    //Naive for loop, look to clean this up
    for (let i = 0; i < sections.value.length; i+=ROW_SIZE) {
        result.push(this.buildRow(sections, i, i+ROW_SIZE, ROW_SIZE));
    }

    return result;
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
      let img = new Image(); //TODO get image
      //Need event listener to make sure image has loaded before we write it to the canvas
      img.addEventListener('load', function() {
        context.drawImage(img,col*SECTION_SIZE, row*SECTION_SIZE, SECTION_SIZE, SECTION_SIZE);
      }, false);
      img.src = color;
      console.log(img);
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
    // console.log(rgbColor);
    // console.log(startingRowPix + startingColPix);
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
      <div>
        {/* <h2>Div based:</h2>
        <div>{this.buildCanvas()}</div> */}
        <h2>Canvas based:</h2>
        {this.getHtmlCanvas()}
        <div>{this.buildCanvas2()}</div>
        
        <DisplaySectionDetails
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
          currentSection={this.state.currentSection}
        />
      </div>
    );
  }
}

export default DisplayCanvas;