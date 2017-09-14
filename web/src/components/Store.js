import React, { Component } from 'react';
import {Config} from './../config.js';
import '../css/Store.css';
import imgLoading from '../img/loading.gif'
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
    console.log('store', props);
    name = props.match.params.id;
    for (var i = 0, len = props.stores.length; i < len; i++) {
      myStore[props.stores[i].id] = props.stores[i];
    }
    myStore = myStore[name]
    console.log('els', els);
    
  }

  componentDidMount() {
    console.log('src', Source);
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
    console.log('els', els);
    const thumbnails = myStore.homepage.map((thumbnail, index) =>{
      const items = thumbnail.items.map((item, index2) =>{
        // console.log(item);
        return (
          <div key={index2} className="inline">
            <Thumbnail props={this.props} data={els.getByID(item)} url={myStore.url} />
          </div>
        );
      });
      return (
        <div key={index}>
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
            <div className="thumbnails">
              {thumbnails}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Store;