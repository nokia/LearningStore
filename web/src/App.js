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
import Search from './components/Search';
import Edit from './components/Edit';
import Source from './components/data';
import Home  from './components/Home';
import B from './components/back';

const item = '/item/';
const pattern = /\/(item|search)\//;

class ModalSwitch extends Component {

  state = { isLoading:true }

  componentWillMount() {
    const { location } = this.props;
    // console.log('willmount', location); 
    if (location.pathname.match(pattern)) {
      let url = location.pathname.split(pattern);
      let name = url[0].slice(1);
      Source.fetch(name).then( rep => this.setState({isLoading:false}) )
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
          <Route path='/:name/search/:text' component={Search} />
          <Route path='/:name/item/:id' component={Collection} />
          <Route path='/:name/edit/:id' component={Edit} />
          <Route path='/:name' component={Store} />
        </Switch>
        {isModal ? <Route path='/:name/item/:id' component={Item} /> : null}
      </div>
    )
  }
}

export default class App extends Component {
  state = { isLoading:true }
  componentWillMount() {
    // console.log('loading store.json');
    fetch(Config.Source + 'store.json')
    .then( resp => resp.json())
    .then( resp => {
      Source.setDefs(resp);
      this.setState({ items:resp, isLoading:false });
    })


  }


  render() {
    if (this.state.isLoading) {
      return (
        <div>          
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

    let basename = Config.Source.slice(1);
    // console.log('pub', process.env.PUBLIC_URL)
    return (
      <Router basename={basename}>
        <Switch>
          <Route exact path='/' render={() => (<Home stores={this.state.items} />)}
            />
          <Route component={ModalSwitch} />
        </Switch>
      </Router>  
    );
  }
}
