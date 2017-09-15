import React, { Component } from 'react';
import B from './back';
import {Config} from './../config.js';
import Source from './data';
import '../css/Item.css';
import MdClose from 'react-icons/lib/md/close';
import renderHTML from 'react-render-html';

var properties;
var item;

class Item extends React.Component{
// export default ({ match, history }) => {

  state = {isLoading:true}
  myStore = {}
  constructor(props) {
    super(props);
    properties = props;
    console.log(props)
    // item = props.location.state.item
    // console.log('itemmm', item)
    let name = props.match.params.name;
    this.myStore = Source.getDef(name)
    console.log(this.myStore);
  }

  componentWillMount() {
    console.log(this.props.match.params.name);
    Source.getSync(this.props.match.params.name)
    .then( (store) => this.setState({isLoading:false, store:store}))
  }

  render(){
    
    if (this.state.isLoading) return null    
    let item = this.state.store.getByID(this.props.match.params.id)
    console.log(item);
    const back = (e) => {
      e.stopPropagation()
      if (B.back) properties.history.goBack()
    }
    let fields = Config.Mapping.map((field, index) =>{
      if(item[field]){
        return (
          <div className="itemField" key={index}>
            <div className="itemFieldTitle">
              {field}
            </div>
            <div className="itemFieldBody">
              {renderHTML(item[field])}
            </div>
          </div>
        );
      }
    });
    return (
      <div
        className="itemOverlay"
      >
        <div className='modal'>
          <div className="itemTitle">
            {Source.format(item.Title)}
            <MdClose color='#FFFFFF' className="pointer itemClose" onClick={back}/>
          </div>
          <div className="itemIcon">
          <img src={this.myStore.url + "/" + item.Icon} />
          </div>
          <div className="itemFields">
            {fields}
          </div>
          
        </div>
      </div>
    )
  }
}
export default Item;