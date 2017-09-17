/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loader from 'halogen/PulseLoader';

import './css/App.css';
import {Config} from './config.js';
import Store  from './components/Store';
import Item  from './components/Item';
import Collection from './components/Collection';
import Source from './components/data';
import Home  from './components/Home';
import B from './components/back';

const item = '/item/';

class ModalSwitch extends Component {

  state = { isLoading:true }

  componentWillMount() {
    const { location } = this.props;
    // console.log('willmount', location);
    if (location.pathname.indexOf(item) > -1) {
      let url = location.pathname.split(item);
      let name = url[0].slice(1);
      Source.fetch(name, Config.Source + name + '.json').then( (rep) => this.setState({isLoading:false}) )
    }
    else this.setState({isLoading:false});
  }    

  render() {

    if (this.state.isLoading) return null;

    const { location } = this.props;
    let isModal, elem;
    if (location.pathname.indexOf(item)>-1) {
      let url = location.pathname.split(item);
      let id = url[1];
      let store = Source.get(url[0].slice(1));
      elem = store.getByID(id);
      if (elem && !elem.Solutions) {
        this.previousLocation = { pathname:B.path || url[0] }
        isModal = true;  
      }
    }

    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path='/:name/item/:id' component={Collection} />
          <Route exact path='/:name' component={Store} />
        </Switch>
        {isModal ? <Route exact path='/:name/item/:id' component={Item} /> : null}
      </div>
    )
  }
}

export default class App extends Component {
  state = { isLoading:true }
  componentWillMount() {
    console.log('loading store.json');
    fetch(Config.Source + 'store.json')
    .then( (resp) => resp.json())
    .then( (resp) => {
      Source.setDefs(resp);
      this.setState({ items:resp, isLoading:false });
    })
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

    this.state.items.forEach( (store) => store.menu = store.menu.reverse() );
    // if(this.state.items.length > 1){
    //   stores = this.state.items;
    // }
    // else{
    //   stores = this.state.items
    //   window.location = "#/"+ this.state.items[0].id + "/";
    // }

    return (
      <Router>
        <Switch>
          <Route 
              exact path='/' 
              render={(props) => (<Home {...props} stores={this.state.items} />)}
            />
          <Route component={ModalSwitch} />
        </Switch>
      </Router>  
    );
  }
}
