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

    const old = JSON.stringify(item);
    let newItem; 
    if (!item.sid) {
      newItem = true;
      item.sid = this.state.name;
      item.ID = 'n.' + new Date().getTime();
      item.Icon = Config.defaultIcon;
      console.log('creating new item', item.ID);
    }

    const submitMethod = (model) => {
      //do something with model when submit success
      Ctl._push(old, item);
      if (newItem) Ctl.update(item);
      if (B.back) this.props.history.goBack();
    };
  
  
    if (item.Solutions) {
      return (
        <Form onSubmit={submitMethod} model={item} >
          <TextField name="Title" label={'Title: '} fieldAttributes={{size:60}}/>
          <TextField name="Icon" label={'Icon: '} fieldAttributes={{size:60}} />
          <TextareaField name="Description" label={'Description: '} fieldAttributes={{rows:10, cols:100}}/>
          <ListField name="Solutions" label={'Items: '}>
            <TextField  />
          </ListField>
          <SubmitField value="Save" />
          </Form>
      );
    }

    const fields = Config.Mapping.map( (field, index) => {
      return <TextareaField key={index} name={field} label={field + ': '} fieldAttributes={{rows:4, cols:100}} />
    });
    return (
      <Form onSubmit={submitMethod} model={item}>
        <TextField name="Title" label={'Title: '} fieldAttributes={{size:60}}/>
        <TextField name="Icon" label={'Icon: '} fieldAttributes={{size:60}} />
        <TextField name="Url" label={'Url: '} fieldAttributes={{size:120}} />
        {fields}
        <SubmitField value="Save" />
      </Form>
    );
}
}
