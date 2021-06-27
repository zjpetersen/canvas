import React from 'react';
import DisplayCanvas from "./DisplayCanvas";
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navigation from './Navigation';
import loadingGif from './media/Spinner-1s-200px.gif';

class App extends React.Component {
  state = { loading: true, drizzleState: null, web3: null };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      if (drizzleState.web3) {
        // console.log("has web3 instance");
        // console.log(drizzleState.web3);
        // console.log(typeof(drizzleState.web3.networkId));
        // console.log(drizzleState.web3.hasOwnProperty('networkId'));
        // console.log(drizzleState);
        this.setState({web3: drizzleState.web3});
      }
      // if (drizzleState.drizzleStatus) {
      //   console.log(drizzleState);
      // }

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState: drizzleState, web3: drizzleState.web3 });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.web3 && this.state.web3.hasOwnProperty('networkId') && typeof (this.state.web3.networkId) === 'undefined') {
      return (
        <main>
          <h1>⚠️</h1>
          <p>This browser has no connection to the Ethereum network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.</p>
        </main>
      )
    }
    if (!this.state.loading) {
      return (
        <Router>
          <div className="App">
            <Navigation />
            <Switch> {/* The Switch decides which component to show based on the current URL.*/}
              {/* <Route exact path='/' component={Main}></Route>
          <Route exact path='/bonus' component={SetColor drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}}></Route> */}
              <Route exact path='/' ><Home drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/></Route>
              <Route exact path='/canvas' > <DisplayCanvas drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/></Route>
            </Switch>
          </div>
        </Router>
      );
    }
    return <div id="loading">
      <p>Loading dapp...</p>
      <img id="loading" src={loadingGif} alt="Loading" />
    </div>
  }
}

export default App;