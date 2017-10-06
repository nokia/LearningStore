/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/
import React, { Component } from 'react';

import {Config} from '../config.js';
import Source from './data';
import B from './back';
import NotFound from './NotFound';

import { Form, TextField, TextareaField, ListField, SubmitField } from 'react-components-form';
import Ctl from './editCtl';
// import TINY from '../lib/tiny.editor';

import '../css/Edit.css';

export default class Edit extends Component {

  state = { isLoading:true }

  componentWillMount() {
    const {name, id} = this.props.match.params;// || this.props.location.state;
    Source.fetch(name, Config.Source + name + '.json').then( (store) => this.setState({isLoading:false, store:store, name:name, id:id}) )
    B.back = true;
  }
  
  render() {
    // B.set(this);
    if (this.state.isLoading) return null;
    const id = this.state.id;
    
    const item = (id === 'item') ? {} : (id === 'collection') ? { Solutions:[] } : this.state.store.getByID(id);
    if (!item) return (<NotFound />);

    let old, newItem; 
    if (item.sid) old = JSON.stringify(item);
    else {
      newItem = true;
      item.sid = this.state.name;
      item.ID = 'n.' + new Date().getTime();
      item.del = true;
      old = JSON.stringify(item);
      delete item.del;
      item.Icon = Config.defaultIcon;
      console.log('creating new item', item.ID);
    }
    
    const submitMethod = (model) => {
      //do something with model when submit success
      Ctl._push(old, item);
      if (newItem) Ctl.update(item);
      if (B.back) this.props.history.goBack();
    };

    const header = (
      <div>
        <div className='editFlow'>
          <label className='editLabel'>ID</label>
          <label className='editField'>{item.ID}</label>
        </div>
        <div className='editFlow'>
          <label className='editLabel'>Title</label>
          <TextField className='editField' name="Title" fieldAttributes={{size:140}}/>
        </div>
        <div className='editFlow'>
          <label className='editLabel'>Icon</label>
          <TextField className='editField' name="Icon" fieldAttributes={{size:140}} />
        </div>  
      </div>
    );
  
    if (item.Solutions) {
      return (
        <Form onSubmit={submitMethod} model={item} >
          {header}
          <div className='editFlow'>
            <label className='editLabel'>Description</label>
            <TextareaField name="Description" className='editField' fieldAttributes={{rows:10, cols:100}}/>
          </div>
          <div className='editFlow'>
            <label className='editLabel'>Items</label>
            <div className='editField'>
              <ListField name="Solutions" >
                <TextField />
              </ListField>
            </div>
          </div>
          <SubmitField className='editSave' value="Save" />
          </Form>
      );
    }

    const fields = Config.Mapping.map( (field, index) => {
      return (
        <div className='editFlow'>
          <label className='editLabel'>{field}</label>
          <TextareaField className='editField' key={index} name={field} fieldAttributes={{rows:4, cols:140}} />
        </div>
      );
    });

    return (
      <Form onSubmit={submitMethod} model={item}>
        {header}
        <div className='editFlow'>
          <label className='editLabel'>Url</label>
          <TextField className='editField' name="Url" fieldAttributes={{size:140}} />
        </div>
        {fields}
        <div className='editFlow'>
          <p className='editLabel'> </p>
          <SubmitField className='editSave' value="Save" />
        </div>
      </Form>
    );
}
}
