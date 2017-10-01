/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';

import '../css/Search.css';
import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

const addLim = 40;

export default class Store extends Component {
  
  state = { isLoading:true, lim:20 }
  search = [];
  counter = 0;
  storeDef;
  thumbnails;

  componentWillMount() {
    const {name, text} = this.props.match.params;    
    Source.getSync(name)
    .then( (store) => {
      B.back = true;
      this.searchInput(text)
      this.setState({isLoading:false});
    });
    this.storeDef = Source.getDef(name);
    this.searchInput = this.searchInput.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.map = this.map.bind(this);
  }

  searchInput(param) {
    // console.log('SEARCH------------')
    this.search = Source.filter(this.props.match.params.name, param);
    this.setState({lim:addLim});
  }

  loadMore() {
    this.setState({lim:this.state.lim + 40});
    this.thumbnails = this.map();
    // console.log(this.thumbnails)
  }

  map() {
    // console.log('ma store', this.props.match.params, this.storeDef)
    this.counter = 0;
    // console.log('mapping', this.counter, this.search)
    
    let ret =  this.search.filter((item) => {
      if (item.Icon) return item;
      return null;
    })
    .map((item, index2) => {
      
      if (item.Icon) {
        this.counter++
        if (this.counter % 5 === 0) {
          return (          
            <Thumbnail  key={index2} noMargin="yes" props={this.props} data={item} store={this.storeDef} /> 
          );
        }
        return (          
          <Thumbnail  key={index2} props={this.props} data={item} store={this.storeDef} />  
        );
      }     
      return null;    
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
    }
    return ret;
  }

  render() {
    B.path = this.props.location.pathname;
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
