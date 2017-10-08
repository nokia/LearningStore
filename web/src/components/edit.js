/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';

import HeaderComponent from './Header';
import Navigation from './Navigation';
import {Config} from '../config.js';
import Source from './data';
import B from './back';
import NotFound from './NotFound';

import { Form, TextField, ListField, CheckboxField, SubmitField, FormEventsListener } from 'react-components-form';
import Ctl from './editCtl';
import Quill from './Quill';
import FaTrash from 'react-icons/lib/fa/trash-o';
import FaPlus from 'react-icons/lib/fa/plus-square-o';

import '../css/Edit.css';

const origin = [] // contains original item values 

let unsaved = false; // detect any change in the item
const eventsListener = new FormEventsListener();
eventsListener.registerEventListener('changeModel', () => unsaved = true );
window.onbeforeunload = (e) => { if (unsaved) alert('You have unsaved modifications. Do not forget to come back to save them if needed...'); }

export default class Edit extends Component {

  state = { isLoading:true }

  componentWillMount() {
    const {name, id} = this.props.match.params;
    Source.fetch(name, Config.Source + name + '.json').then( store => {
      this.item = (id === 'item') ? {} : (id === 'collection') ? { Solutions:[] } : store.getByID(id);
      this.setState({isLoading:false, name:name});
    });
    B.back = true;
  }

  componentDidMount() { setTimeout( () => unsaved = false, 100  ); } // html can be improved by Quill, but no user changes

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
  render() {
    if (this.state.isLoading) return null;    
    
    let item = this.item;
    if (!item) return (<NotFound />);

    let newItem; 
    if (item.sid) origin[item.ID] = origin[item.ID] || JSON.stringify(item);
    else {
      newItem = true;
      item.sid = this.state.name;
      item.ID = 'n.' + new Date().getTime();
      item.del = true;
      origin[item.ID] = JSON.stringify(item);
      delete item.del;
      item.Icon = Config.defaultIcon;
      console.log('creating new item', item.ID);
    }
    
    const submitMethod = (model) => {
      Ctl._push(origin[item.ID], model);
      delete origin[item.ID];
      if (newItem) Ctl.update(model);
      if (B.back) this.props.history.goBack();
    };

    const storeDef = Source.getDef(this.state.name);
    const header = (
      <div>
        <div className="head">
          <HeaderComponent props={this.props} data={storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={storeDef}/>
            </div>
          </div>
        </div>
        <div className='top'></div>

        <div className='editFlow'>
          <label className='editLabel'>ID</label>
          <TextField className='editField' name="ID" fieldAttributes={{disabled:true, style:{border:0, fontSize:'110%'}}}/>
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
    );
    
    const submit = <SubmitField className='editSave' value="Save" />
    const add = <FaPlus />
    const remove = <FaTrash />
    const wip = (
      <div className='editFlow'>
        <label className='editLabel'>Edit Mode</label>
        <CheckboxField name="Wip" />
      </div>
    );

    if (item.Solutions) {
      return (
        <Form onSubmit={submitMethod} model={item} eventsListener={eventsListener} >
          {header}
          <Quill name='Description'/>
          <div className='editFlow'>
            <label className='editLabel'>Items</label>
            <div>
              <ListField name='Solutions' className='listfield' addButton={{className:'addButton', value:add}} removeButton={{className:'delButton', value:remove}}>
                <TextField className='item' />
              </ListField>
            </div>
          </div>
          {wip}
          {submit}
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
        <div className='editFlow'>
          <label className='editLabel'>Url</label>
          <TextField className='editField' name="Url" />
        </div>
        {fields}
        {wip}
        {submit}
      </Form>
    );
  }
}
