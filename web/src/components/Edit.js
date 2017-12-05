/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';
import { Form, TextField, ListField, CheckboxField, SubmitField, FormEventsListener } from 'react-components-form';
import Quill from './Quill';
import FaTrash from 'react-icons/lib/fa/trash-o';
import FaPlus from 'react-icons/lib/fa/plus-square-o';

import HeaderComponent from './Header';
import Navigation from './Navigation';
import NavigationEdit from './NavigationEdit';
import {Config} from '../config.js';
import Source from './data';
import B from './back';
import NotFound from './NotFound';
import Ctl from './editCtl';
import wipC from './editWip';
import EditCtl from './editCtl';
import { Radio, Button, Input } from 'semantic-ui-react'
import '../css/Edit.css';

const origin = [] // contains original item values 

let ready = false;
let currentID = '';
const eventsListener = new FormEventsListener();
eventsListener.registerEventListener('changeModel', () => {
  if (!ready) return;
  wipC.unsave(currentID);
  setunLoad();
});

const unload = (e) => { e.returnValue = 'ok'; return 'ok'; }
const setunLoad = () => window.onbeforeunload = wipC.stay() ? unload : null; 

export default class Edit extends Component {

  state = { isLoading:true, selectedItems:[] }
  storeDef;
  itemsSolutions = [];
  componentWillMount() {
    const {name, id} = this.props.match.params;
    Source.fetch(name).then( store => {
      this.item = (id === 'item') ? {} : (id === 'collection') ? { Solutions:[] } : store.getByID(id);
      var selectedItems = Object.keys(store.ids).map( key => store.ids[key] )
      
      this.setState({name:name, store:selectedItems, selectedItems:selectedItems, isLoading:false});
      this.selectItems(20);
      console.log(selectedItems);
      // console.log('ss', store);

    });
    B.back = true;




    
  }
  componentDidUpdate(){
    EditCtl.switchEditMode(true, false);
  }
  componentDidMount() { 
    ready = false;
    setTimeout( () => ready = true, 100  ); // html can be improved by Quill, but no user changes
  } 
/*
  componentDidMount() {
    setTimeout(() => {
      const height = document.getElementById('nlsForm').clientHeight;
      // console.log(height)
      if (height > window.innerHeight)
        document.firstElementChild.setAttribute('style', 'overflow-y: scroll');
      else
        document.firstElementChild.setAttribute('style', 'overflow-y: hidden');
    }, 100)
  }
*/  

  selectItems(limit, search){
    var data = this.state.store
    if(search){
      data = data.filter(item0 => {
        if(item0.Title.indexOf(search) !== -1){
          return true;
        }
      });
    }
    data = data.filter( (item1) => {
      if (item1 === wipC || item1 === wipC.unsaved) return false;
      return true;
    })
    .slice(0, limit);
    this.setState({selectedItems:data});  
  }

  handleSearch(btn){
    this.selectItems(20, btn.target.value);
  }

  handleAdd(id){
    console.log(id.target.value, id);
  }
  render() {

    // console.log('eeeeed', this.state.store);
    if (this.state.isLoading) return null;    
    
    let item = this.item;
    if (!item) return (<NotFound />);

    if (item.sid) origin[item.ID] = origin[item.ID] || JSON.stringify(item);
    else {
      console.log('creating new item', item.ID);
      item.sid = this.state.name;
      item.ID = 'n.' + new Date().getTime();
      item.del = true;
      origin[item.ID] = JSON.stringify(item);
      delete item.del;
      item.Icon = Config.defaultIcon;
      Ctl.update(item); // so that it can be searched and stored in the unsaved collection
      wipC.unsave(item.ID); // new item
      setunLoad();
    }
    currentID = item.ID;
    
    const submitMethod = (model) => {
      item.date = new Date().getTime();
      Ctl._push(origin[item.ID], item);
      delete origin[item.ID];
      wipC.save(item.ID);
      // console.log(model, item)
      setunLoad();

      if (B.back) this.props.history.goBack();
    };

    const storeDef = Source.getDef(this.state.name);
    const header = (
      <div>
        <div id="editDimmer"><div ><img src="" id="editDimmerImg" alt="Dimmer"/><div id="editDimmerText"></div></div></div>
        <div className="head">
          <HeaderComponent props={this.props} data={storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={storeDef}/>
            </div>
          </div>
          <div id="edit">
            <div className="wrapper">
              <NavigationEdit props={this.props} data={this.storeDef}/>
            </div>
          </div>
        </div>
        <div className='top'></div>
        
        <div className="wrapperEdit edit_box">
          <div className='editFlow'>
            <label className='editLabel'>ID</label>
            <TextField className='editField editFieldDisabled' name="ID" fieldAttributes={{disabled:true, style:{border:0, fontSize:'110%'}}}/>
            </div>
          <div className='editFlow'>
            <label className='editLabel'>Title</label>
            <TextField className='editField' name="Title" />
          </div>
          <div className='editFlow'>
            <label className='editLabel'>Icon</label>
            <TextField className='editField' name="Icon" />
          </div>  
        </div>
      </div>
    );
    //<TextField className='editField ' name="ID" fieldAttributes={{disabled:true, style:{border:0, fontSize:'110%'}}}/>
    
    // const submit = <SubmitField className='editSave' value="Save" />
    const submit = <Button content='Save' className='editSave' icon='right arrow' color='orange' labelPosition='right' />
    const add = <FaPlus />
    const remove = <FaTrash />
    const wip = (
      <div className='editFlow'>
        <label id="toggleWipLabel" className='editLabel'>Edit Mode</label>
        <Radio 
          className="toggleWip"
          name="Wip" 
          toggle 
        />
        
      </div>
    );

  //   <div>
  //   <ListField name='Solutions' className='listfield' addButton={{className:'addButton', value:add}} removeButton={{className:'delButton', value:remove}}>
  //     <TextField className='item' />
  //   </ListField>
  // </div>

    // const selectItems = (

      
    //   <div className='editFlow'>
    //     <label for="toggle1" id="toggleWipLabel" className='editLabel'>Edit Mode</label>
    //     <CheckboxField id="toggleWip" name="Wip" />
        
    //   </div>
    // );
  
    
    const selectedItemsMap = this.state.selectedItems.map((item) =>{
      // console.log(item);
          return (
            <div className="selectItem" title="Click to add this item" onClick={this.handleAdd.bind(this)} >
              <div className="selectItemTitle">
                {item.Title}
              </div>
            </div>
          )

      })
        
  

    if (item.Solutions) {
      
      return (
        <Form onSubmit={submitMethod} model={item} eventsListener={eventsListener} >
          {header}
          <div className="wrapperEdit edit_box">
            <Quill name='Description'/>
            <div className='editFlow'>
              <label className='editLabel'>Items</label>
              
              <div className='editFlow selectItems'>
                <Input className="selectSearch" fluid onChange={this.handleSearch.bind(this)} size='mini' icon='search' placeholder='Search...' />
                {selectedItemsMap}
              </div>
            </div>
            {wip}
            {submit}
          </div>
        </Form>
      );
    }

    const fields = Config.Mapping.map( (field, index) => {
      return (
        <Quill name={field} key={index}/>
      );
    });

    return (
      <Form onSubmit={submitMethod} model={item} eventsListener={eventsListener} >
        {header}
        <div className="wrapperEdit edit_box">
            <div className='editFlow'>
              <label className='editLabel'>Url</label>
              <TextField className='editField' name="Url" />
            </div>
            {fields}
            {wip}
            {submit}
        </div>
      </Form>
    );
  }
}
