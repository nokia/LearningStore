/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/

import {Config} from '../config.js';
import editCtl from './editCtl';
import wip from './editWip';

class Data {
  // data = [wip, wip.unsaved];
  ids = [];

  create(name, data) {
    this.ids[wip.ID] = wip;
    this.ids[wip.unsaved.ID] = wip.unsaved;
    data.forEach( item => {
      if (item.ID) {
        this.ids[item.ID] = item;
        // this.data.push(item);
        // item.type = item.type || 2;
        delete item.type; // not needed anymore
        // if (!item.Icon) item.Icon = Config.defaultIcon;
        if (!item.sid) item.sid = name;
        if (typeof item.Url === 'object')
          if (item.Url.all) item.Url = item.Url.all; // old schema
          else delete item.Url; 
        if (item.Url) {
          const tmp = item.Url.split('(');
          item.Url = tmp[0].trim();
          if (tmp[1]) item.btn = tmp[1].split(')')[0];
        }
        // item.date = item.date || -1;
        if (item.Solutions) item.Solutions = item.Solutions.filter( id => id );
      }
    });

    editCtl.load(name);// apply changes if any
  }

  getByID(id) { return this.ids[id]; }

  filter(name, term) {
    term = term.toLowerCase();
    return Object.keys(this.ids).map( key => this.ids[key] ).filter( item => 
      item.del ? false : Object.keys(item).filter( 
        key => (typeof item[key] === 'string' || item[key] instanceof String) && item[key].toLowerCase().indexOf(term) > -1 ).length 
      ); 
/*
    return Object.keys(this.ids).map( key => this.ids[key] ).filter( item => {
      let keys = Object.keys(item);
      for (let i=0; i<keys.length; i++) {
        let key = keys[i];
        if ((typeof item[key] === 'string' || item[key] instanceof String) &&
          item[key].toLowerCase().indexOf(term) > -1)
          return true;
      }
      return false;
    })    
*/
  }
}

class Store {
  defs = [];
  stores = [];

  get(name) { return this.stores[name]; }
  set(name, data) { 
    if (!this.get(name)) {
      this.stores[name] = new Data();
      this.stores[name].create(name, data);
      console.log('loaded', name, Object.keys(this.stores[name].ids).length, 'items');
    }
    return this.get(name);
  }

  getSync(name) {
    return new Promise( resolve  => {
      const store = this.get(name);
      if (store) resolve(store);
      else this.synchro = resolve;
    });
  }

  getDef(name) { return this.defs[name]; }
  setDefs(storeJson) { storeJson.forEach( store => this.defs[store.id] = store ); }

  fetch(name, zip) {
    return new Promise( (resolve, reject) => {
      if (this.stores[name]) resolve(this.stores[name]);
      else {
        let url = this.defs[name].url;
        if (url.indexOf('http://learningstore.nokia.com') === 0) url = `${Config.Source}${name}.json`;
        else {
          if (url.charAt(url.length-1) === '/') url = url.slice(0, -1);
          url = `${Config.Source}${url}/${name}.json`;
        }
        const req = new XMLHttpRequest();
        // console.log(url)
        req.open('GET', url, true);
        req.responseType = zip ? 'arraybuffer' : 'text';
        req.onload = (oEvent) => {
          if (req.response) {
            let responseJson = JSON.parse(zip ? (req.response, {to: 'string'}) : req.responseText);
            resolve(this.set(name, responseJson));
            if (this.synchro) this.synchro(this.get(name));
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

  filter(name, term) { return this.get(name).filter(name, term); }

}

export default new Store();