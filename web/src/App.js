import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './css/App.css';
import {Config} from './config.js';
import Store  from './components/Store';
import Item  from './components/Item';
import Collection from './components/Collection';
import Source from './components/data';
import Home  from './components/Home';
import NotFound  from './components/NotFound';
import B from './components/back';

var Loader = require('halogen/PulseLoader');
var stores = [];

const item = '/item/';
class ModalSwitch extends React.Component {

  state = { isLoading:true }

  componentWillMount() {
    const { location } = this.props;
    console.log('willmount', location);
    if (location.pathname.indexOf(item)>-1) {
      let url = location.pathname.split(item);
      let name = url[0].slice(1);
      Source.getSync(name)
      .then( (store) => {
        this.setState({isLoading:false});
      })
    }
    else this.setState({isLoading:false});
    
  }    

  render() {

    if (this.isLoading) return null;
    const { location } = this.props;
    let isModal;
    if (location.pathname.indexOf(item)>-1) {
      let url = location.pathname.split(item);
      let id = url[1];
      let name = url[0].slice(1);

      let store = Source.get(name);
      
      if (!store.getByID(id).Solutions) {
        this.previousLocation = {pathname:url[0]}
        isModal = true;  
      }
    }
    // console.log(name);
  // console.log('modal', this.isModal, 'loading');
    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route path='/:name/item/:id' component={Collection} />
          <Route 
            exact path='/' 
            render={(props) => (<Home {...props} stores={stores} />)}
          />
          <Route 
            exact path='/:name' 
            render={(props) => (<Store {...props} stores={stores} />)}
          />


        </Switch>
        {isModal ? <Route path='/:name/item/:id' component={Item} /> : null}
      </div>
    )
  }
}

class App extends Component {
  state = { isLoading:true }
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
    }
    else{
      stores = this.state.items
      window.location = "#/"+ this.state.items[0].id + "/";
    }

    return (
      <Router>
        <Route component={ModalSwitch} />
      </Router>  
    );
  }
}
export default App;