/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import { StyleSheet } from 'react-native';
import pako from 'pako';

class Data {
  data = [];
  ids = [];
  create(name, data) {
    data.forEach( (item) => {
      if (item.ID) {
        this.ids[item.ID] = item;
        this.data.push(item);
        //item.type = item.type || 2;
        if (!item.sid) item.sid = name;
        if (item.Url && item.Url.all) {
          item.Url = item.Url.all; // for compatibility purpose
          let tmp = item.Url.split('(');
          item.Url = tmp[0].trim();
          if (tmp[1]) item.btn = tmp[1].split(')')[0];
        }
      }
    });
  }
  getByID(id) { return this.ids[id]; }
}

class Store {
  defs = [];
  stores = [];

  static loading = 'Please wait while data are loading...';

  constructor() {
    let styles = StyleSheet.create({
      font: { fontFamily:"NokiaPureText-Light" },
      icon: { width: 100, height: 50 }
    });
    this.font = styles.font;
    this.icon = styles.icon;
  }
  
  get(name) { return this.stores[name]; }
  set(name, data) { 
    if (!this.get(name)) {
      this.stores[name] = new Data();
      this.stores[name].create(name, data);
      console.log(name, this.stores[name].data.length);
    }
    return this.get(name);
  }

  getDef(name) { return this.defs[name]; }
  setDefs(storeJson) { storeJson.forEach( (store) => this.defs[store.id] = store ); }

  fetch(name, url, zip) {
    return new Promise( (resolve, reject) => {
      if (this.stores[name]) resolve(this.stores[name]);
      else {
        let req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = zip ? 'arraybuffer' : 'text';
        req.onload = (oEvent) => {
          if (req.response) {
            let responseJson = JSON.parse(zip ? pako.inflate(req.response, {to: 'string'}) : req.responseText);
            resolve(this.set(name, responseJson));
          }
        }
        req.onerror = (oEvent) => { 
          console.log(oEvent);
          reject(oEvent); 
        }
        req.send(null);
      }
    });
  }  

  format(text) {
    return text ? text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/<.*?>/g, '') : '';
  }

  filter(id, term) {
    term = term.toLowerCase();
  //  console.log('searching', id, 'for', term)
    return this.get(id).data.filter((item) => {
      let keys = Object.keys(item);
      for (let i=0; i<keys.length; i++) {
        let key = keys[i];
        if ((typeof item[key] === 'string' || item[key] instanceof String) &&
          item[key].toLowerCase().indexOf(term) > -1)
          return true;
      }
    })
  }
}

export default all = new Store();
