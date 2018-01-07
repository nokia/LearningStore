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

  componentWillMount() {
    const {name} = this.props.match.params;    
    Source.getSync(name)
    .then( store => {
      B.back = true;
      // this.searchInput(text)
      this.setState({isLoading:false});
    });
    this.storeDef = Source.getDef(name);
  }

  searchInput = (param) => {
    // console.log('SEARCH------------')
    this.search = Source.filter(this.props.match.params.name, param);
    this.setState({lim:addLim});
  }

  loadMore = () => {
    this.setState({lim:this.state.lim + 40});
    this.thumbnails = this.map();
  }

  map() {
    let counter = 0;
    
    let ret =  this.search.filter( item => item.Icon )
    .map((item, index2) => {
      
      if (item.Icon) {
        counter++
        if (counter % 5 === 0) {
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

    if (ret.length > this.state.lim+1) {
      ret = ret.slice(0, this.state.lim);
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
    B.set(this);
    
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

    const { name, text } = this.props.match.params; 
    this.search = Source.filter(name, text);
    console.log('search', this.search)
    this.thumbnails = this.map();
    
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
