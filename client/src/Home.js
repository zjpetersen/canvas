import React from 'react';
import BuySectionFree from "./BuySectionFree";
import SetColor from "./SetColor";
import './style/Home.css';

class Home extends React.Component {


  header = () => {
    let result = 
      <header class="image sizing" id="head">
        <div class="canvas background-text">
          <span class="canvas-tag">Canvas</span>
        </div>
        <div class="bottom">
          <span class="background-text">Collaborative art</span>
        </div>
      </header>

    return result;
  }

  info = () => {
    let result = 
      <div>
        <div class="info">
          <h2>How does it work?</h2>
          <p>Canvas is a Dapp running on the ethereum blockchain.  
            Users are able to create their own artwork and add it to a section of the canvas.
            If other users find it valuable, they can purchase and modify the section, or keep it the same.</p>

            <h2>Want to get involved?</h2>
            <p>Free sections are going fast, but there are still some available! Claim yours now to make your mark.  </p>

        </div>


      </div>




    return result;
  }

render() {
    return (
      <div>
        {this.header()}
      <div class="home content">
        {this.info()}
        {/* <ReadSection
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        /> */}
        {/* <DisplaySectionDetails
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        /> */}
        <BuySectionFree
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        />
        <SetColor
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        />
      </div>
      <div class="footer">Want to learn more? Check out our GitHub.</div>
     </div>
    );
}
}

export default Home;