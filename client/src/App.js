// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import DisplayCanvas from "./DisplayCanvas";
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navigation from './Navigation';

class App extends React.Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
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

}

export default App;