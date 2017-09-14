import React, { Component } from 'react';
import {Config} from './../config.js';
import '../css/Store.css';
import imgSearch from '../img/search.png'
import SliderHome from './SliderHome';
import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';

var Loader = require('halogen/PulseLoader');
var els;
var myStore = {};
var name;
class Store extends Component {
  
  state = { isLoadingStore:true }
  constructor(props) {
    super(props);
    name = props.match.params.id;
    for (var i = 0, len = props.stores.length; i < len; i++) {
      myStore[props.stores[i].id] = props.stores[i];
    }
    myStore = myStore[name]
    
  }

  componentDidMount() {
    // Source.fetch('employee', "employee.json" ).then((rep) =>{
    //   this.setState({isLoading:false});
    //   els = Source.get('employee')
    //   // console.log(els.getByID('c.33'));

    // })

    Source.fetch(name, 'employee.json').then((rep) =>{
      els = Source.get('employee');
      this.setState({isLoadingStore:false});
      // console.log(els.getByID('c.33'));
      console.log('elssss', els);

    })

    // console.log(this.state.items);
  
    // setTimeout(function() { 
    //   this.setState({ isLoading:false}); }
    //   .bind(this)
    //   ,500000
    // );
  }
  render() {
    
    if (this.state.isLoadingStore) {
      return (
        <div>
          <div className="head">
            <HeaderComponent props={this.props} data={myStore}/>
          </div>
          <div className="store">
            <div className="loading">
              <Loader color="#FFA500" size="16px" margin="4px"/>
            </div>
          </div>
        </div>
      );
    }
    // console.log(this.state);
    const thumbnails = myStore.homepage.map((thumbnail, index) =>{
      const items = thumbnail.items.map((item, index2) =>{
        // console.log(item);
        return (
          <Thumbnail  key={index2} props={this.props} data={els.getByID(item)} url={myStore.url} />
        );
      });
      return (
        <div key={index} className="thumbnails">
          <div className="catTitle">
            {thumbnail.title}
          </div>
          {items}
        </div>
      );
    });

    return (
      <div>
        <div className="head">
          <HeaderComponent props={this.props} data={myStore}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={myStore}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            <SliderHome props={this.props} data={myStore}/>
            {thumbnails}
          </div>
        </div>
      </div>
    );
  }
}
export default Store;