import React from 'react';
import DisplayCanvas from "./DisplayCanvas";
import Home from './Home';
import UploadArtworkInstructions from './UploadArtworkInstructions';
import PrivacyPolicy from './PrivacyPolicy';
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

    if (drizzle) {
      // subscribe to changes in the store
      this.unsubscribe = drizzle.store.subscribe(() => {

        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();

        if (drizzleState.web3) {
          this.setState({ web3: drizzleState.web3 });
        }

        // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {
          this.setState({ loading: false, drizzleState: drizzleState, web3: drizzleState.web3 });
        }

      });
    }

    //Should reload the page if the account or network is changed
    if (window.ethereum) {
      console.log(window.ethereum);
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
      });
      window.ethereum.on('networkChanged', (networkId) => {
        window.location.reload();
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    } 
  }

  render() {
    //Not connected to a network or account is not connected
    if (this.state.web3 
          && ((this.state.web3.hasOwnProperty('networkId') && typeof (this.state.web3.networkId) === 'undefined') || this.state.web3.status === 'failed')
      ) {
      return (
        <main>
          <h1>⚠️</h1>
          <p>This browser has no connection to the Ethereum network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.</p>
        </main>
      )
    // } else if (this.props.networkId && (this.props.networkId !== 1 && this.props.networkId !== 4 && this.props.networkId !== 5777) ) {
    } else if (this.props.networkId && (this.props.networkId !== 4 && this.props.networkId !== 5777 && this.props.networkId !== 137) ) {
      return (
        <main>
          <h1>⚠️</h1>
          <p>This dapp only supports connecting to Polygon.  Please <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask">change your network</a> to get the full experience.</p>
        <Router>
          <div className="App">
            <Navigation displayCanvas={true}/>
            <Switch> 
              <Route exact path='/' > <DisplayCanvas drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} isMetaMask={false}/></Route>
              <Route path='/tile/:tileId' render={(tileId) => <DisplayCanvas tileId={tileId} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} isMetaMask={false}/>}></Route>
              <Route exact path='/upload' ><UploadArtworkInstructions drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/></Route>
              <Route exact path='/faq' ><Home drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/></Route>
              <Route exact path='/privacy' > <PrivacyPolicy /></Route>
            </Switch>
          </div>
        </Router>
        </main>
      )
    } else if (!this.state.loading || !this.props.hasProvider) {
      return (
        <Router>
          <div className="App">
            <Navigation displayCanvas={true}/>
            <Switch> {/* The Switch decides which component to show based on the current URL.*/}
              {/* <Route exact path='/' component={Main}></Route>
          <Route exact path='/bonus' component={SetColor drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}}></Route> */}
              <Route exact path='/' > <DisplayCanvas drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} isMetaMask={window.ethereum && window.ethereum.isMetaMask}/></Route>
              <Route path='/tile/:tileId' render={(tileId) => <DisplayCanvas tileId={tileId} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} isMetaMask={window.ethereum && window.ethereum.isMetaMask}/>}></Route>
              <Route exact path='/faq' ><Home drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/></Route>
              <Route exact path='/upload' ><UploadArtworkInstructions drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/></Route>
              <Route exact path='/privacy' > <PrivacyPolicy /></Route>
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