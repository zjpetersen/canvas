import React from "react";

class DisplayCanvas extends React.Component {
  state = { sectionsArray: null, sections: null, canvas: null};

  componentDidMount() {
    const canvasRef = this.props.drizzle.contracts.Canvas;
    const sectionsArray = canvasRef.methods["getSections"].cacheCall();
    this.setState({sectionsArray: sectionsArray});
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
        row.push(<div key={i} style={style}/>);
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
    const ROW_SIZE = 10
    //Naive for loop, look to clean this up
    for (let i = 0; i < sections.value.length; i+=ROW_SIZE) {
        result.push(this.buildRow(sections, i, i+ROW_SIZE, ROW_SIZE));
    }

    return result;
  }

  render() {
    return (
      <div>
        <div>{this.buildCanvas()}</div>
      </div>
    );
  }
}

export default DisplayCanvas;