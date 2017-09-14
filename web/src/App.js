import React, { Component } from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom'
import './css/App.css';
import {Config} from './config.js';
import Store  from './components/Store'
import Item  from './components/Item'
import Source from './components/data';
import Home  from './components/Home'


// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <div className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h2>Welcome to React2</h2>
//         </div>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }
var Loader = require('halogen/PulseLoader');
var stores = [];
class App extends Component {
  state = { isLoading:true }
  // constructor(props){
  //   super(props);
  // }
  componentDidMount() {
    fetch(Config.Source + 'store.json')
    .then( (resp) => resp.json())
    .then( (resp) => {
      this.setState({ items:resp, isLoading:false });
      Source.setDefs(resp);
    })
    
    // setTimeout(function() { 
    //   this.setState({ isLoading:false}); }
    //   .bind(this)
    //   ,500000
    // );
  }
  render() {
    if (this.state.isLoading) {
      return (
        <div>
          <div className="head">
          </div>
          <div className="store">
            <div className="loading">
              <Loader color="#FFA500" size="16px" margin="4px"/>
            </div>
          </div>
        </div>
      );
    }
    for (var i in this.state.items) {
      this.state.items[i].menu = this.state.items[i].menu.reverse();
    }
    if(this.state.items.length > 1){
      stores = this.state.items;
    }else{
      stores = this.state.items
      window.location = "#/"+ this.state.items[0].id + "/";
    }
    return (
      <HashRouter>
        <Switch>
          <Route 
            exact path='/' 
            render={(props) => (<Home {...props} stores={stores} />)}
          />
          <Route 
            exact path='/:id' 
            render={(props) => (<Store {...props} stores={stores} />)}
          />
          <Route exact path='/:name/item/:id' component={Item} />
          <Route exact component={NotFound} />
        </Switch>
      </HashRouter>

    );
  }
}


const NotFound = () => <h1>Page not found</h1>

export default App;