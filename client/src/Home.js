import React from 'react';
import ReadSection from "./ReadSection";
import BuySectionFree from "./BuySectionFree";
import DisplaySectionDetails from "./DisplaySectionDetails";
import SetColor from "./SetColor";

class Home extends React.Component {

render() {
    return (
      <div className="Home">
        <ReadSection
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        />
        <DisplaySectionDetails
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        />
        <BuySectionFree
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        />
        <SetColor
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        />
      </div>
    );
}
}

export default Home;