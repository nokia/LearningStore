/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import renderHTML from 'react-render-html';

import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

export default class Collection extends Component {

  state = { isLoading:true, lim:20  }
  counter = 0;
  storeDef;
  thumbnails;

  componentWillMount() {
    Source.getSync(this.props.match.params.name)
    .then( (store) => this.setState({isLoading:false, store:store}) )

    
    this.storeDef = Source.getDef(this.props.match.params.name);
    this.loadMore = this.loadMore.bind(this);
    this.map = this.map.bind(this);
  }

  loadMore(){
    this.setState({lim:this.state.lim + 40});
    this.thumbnails = this.map();
    // console.log(this.thumbnails)
  }

  map(){
    // console.log('ma store', this.props.match.params, this.storeDef)
    this.counter = 0;
    const { id } = this.props.match.params;
    let store = this.state.store;
    let coll = this.state.store.getByID(id);
    let ret = coll.Solutions.filter(function(itemID, index) {
      let item = store.getByID(itemID);
      if (item && item.Icon){
        return item;
      }
      return null;
    })
    .map((itemID, index) => {
      let item = store.getByID(itemID);
      this.counter++
      if(this.counter % 5 === 0){
        // console.log('countrt mod')
        return (          
          <Thumbnail  key={itemID} noMargin="yes" props={this.props} data={item} store={this.storeDef} />
        );
      }else{
        return (          
          <Thumbnail  key={itemID} props={this.props} data={item} store={this.storeDef} />
        );
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
    }
    return ret;
  }

  render() {
    
    if (this.state.isLoading) return null;

    B.path = this.props.location.pathname;
    // console.log(B.path)
    
    const { id } = this.props.match.params;
    // let store = this.state.store;
    // let storeDef = Source.getDef(name);

    let coll = this.state.store.getByID(id);
    
    this.thumbnails = this.map()
    return (
      <div>
        <div className="head">
          <HeaderComponent props={this.props} data={this.storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={this.storeDef}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            <h2>{ coll.Title }</h2>
            <div>{ renderHTML(coll.Description || '') } </div>
            { this.thumbnails }
          </div>
        </div>
      </div>
    );
  }
}