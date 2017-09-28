/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';

import {Config} from './../config.js';
import '../css/Store.css';
import SliderHome from './SliderHome';
import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

export default class Store extends Component {
  
  state = { isLoading:true }
  search = [];
  componentWillMount() {
    const {name} = this.props.match.params;    
    // console.log('loading', name);
    Source.fetch(name, Config.Source + name + '.json').then( (rep) => {
      this.setState({isLoading:false});
      B.back = true;
    })
    console.log('seaerch construc')
    
    this.searchInput = this.searchInput.bind(this);

  }
  searchInput(param) {
    console.log('SEARCH------------')
    this.search = Source.filter(this.props.match.params.name, param);
  }

  render() {
    B.path = this.props.location.pathname;
    
    const {name} = this.props.match.params;    
    let storeDef = Source.getDef(name);
    if (this.state.isLoading) {
      return (
        <div>
          <div className="head">
            <HeaderComponent searchInput={this.searchInput} props={this.props} data={storeDef}/>
          </div>
          <div className="store">
            <div className="loading">
              <Loader color="#FFA500" size="16px" margin="4px"/>
            </div>
          </div>
        </div>
      );
    }

    let store = Source.get(name);    
    console.log(this.search)
    let thumbnails = this.search.map((item, index2) =>{
      return <Thumbnail  key={index2} props={this.props} data={item} store={storeDef} />          
    });
     

    
  

    return (
      <div>
        <div className="head">
          <HeaderComponent searchInput={this.searchInput} props={this.props} data={storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={storeDef}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            { thumbnails }
          </div>
        </div>
      </div>
    );
  }
}
