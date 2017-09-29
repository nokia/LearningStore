/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';

import {Config} from './../config.js';
import '../css/Search.css';
import SliderHome from './SliderHome';
import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

export default class Store extends Component {
  
  addLim = 40;
  state = { isLoading:true, lim:20 }
  search = [];
  counter = 0;
  storeDef;
  thumbnails;
  componentWillMount() {
    const {name} = this.props.match.params;    
    // console.log('loading', name);
    Source.fetch(name, Config.Source + name + '.json').then( (rep) => {
      this.setState({isLoading:false});
      B.back = true;
    })
    // console.log('seaerch construc')
    
    this.searchInput = this.searchInput.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.map = this.map.bind(this);

    console.log('const', this.props)

    // if (!this.state.isLoading) {
      this.storeDef = Source.getDef(this.props.match.params.name);
      this.searchInput(this.props.match.params.text)
    // }


  }
  searchInput(param) {
    console.log('SEARCH------------')
    this.search = Source.filter(this.props.match.params.name, param);
    this.state.lim = this.addLim;
  }

  loadMore(){
    this.setState({lim:this.state.lim + 40});
    this.thumbnails = this.map();
    // console.log(this.thumbnails)
  }

  map(){
    // console.log('ma store', this.props.match.params, this.storeDef)
    this.counter = 0;
    // console.log('mapping', this.counter, this.search)


    
    let ret =  this.search.filter(function(item) {
      if (item.Icon){
        return item;
      }
    })
    .map((item, index2) =>{
      
      if(item.Icon){
        this.counter++
        if(this.counter % 5 == 0){
          return (          
            <Thumbnail  key={index2} noMargin="yes" props={this.props} data={item} store={this.storeDef} /> 
          );
        }else{
          return (          
            <Thumbnail  key={index2} props={this.props} data={item} store={this.storeDef} />  
          );
        }
      }         
    });

    // console.log('ret', ret)
    
    if (ret.length > this.state.lim+1){
      // console.log('length', this.state.lim, ret.length)
      ret = ret.slice(0, this.state.lim)
      // console.log('length', this.state.lim, ret.length)
      return (
        <div>
          <div>{ret}</div>
          <div className="loadMore" onClick={this.loadMore}>Load more...</div>
        </div>
      );
    }else{
     return ret
    }
  }
  render() {
    B.path = this.props.location.pathname;
    
    // const {name} = this.props.match.params;    
    // let storeDef = Source.getDef(name);
    if (this.state.isLoading) {
      return (
        <div>
          <div className="head">
            <HeaderComponent searchInput={this.searchInput} props={this.props} data={this.storeDef}/>
          </div>
          <div className="store">
            <div className="loading">
              <Loader color="#FFA500" size="16px" margin="4px"/>
            </div>
          </div>
        </div>
      );
    }

    // let store = Source.get(name);   
    this.thumbnails = this.map()
     

    
    // console.log(this.thumbnails);

    return (
      <div>
        <div className="head">
          <HeaderComponent searchInput={this.searchInput} props={this.props} data={this.storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={this.storeDef}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            { this.thumbnails }
          </div>
        </div>
      </div>
    );
  }
}
