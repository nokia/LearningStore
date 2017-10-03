/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import {saveAs} from 'file-saver';

import Source from './data';
import B from './back';
import {Config} from '../config.js';

const itemParse = '/item/';

localStorage.edit = localStorage.edit || '[]';
localStorage.editPos = localStorage.editPos || '0';
localStorage.authorID = localStorage.authorID || new Date().getTime().toString();

document.addEventListener("keypress", (event) => {
  if (event.shiftKey) {
    event.stopPropagation();
    switch (event.keyCode) {
      case 67: // shift-c
        edit.create('collection');
        break;
      case 68: // shift-d
        edit.dump();
        break;
      case 69: // shift-e
        edit.modify();
        break;
      case 78: // shift-n
        edit.create('item');
        break;
      case 79: // shift-o
        edit.open();
        break;
      case 82: // shift-r
        edit.reset();
        break;
      case 83: // shift-s
        edit.saveAs();
        break;
      case 88: // shift-x
        edit.del();
        break;
      case 89: // shift-y
        edit.redo();
        break;
      case 90: // shift-z      
        edit.undo();
        break;
      default:
    }
  }
});

const file = document.createElement('input'); // the file reader
file.setAttribute("type", "file");
file.addEventListener('change', (evt) => reader.readAsText(file.files[0]) );
const reader = new FileReader();
reader.onload = () => {
  console.log(reader.result);
  let pos = JSON.parse(localStorage.editPos);  
  let storage = JSON.parse(localStorage.edit).slice(0, pos);
  try {
    let addon = JSON.parse(reader.result);
    localStorage.edit = JSON.stringify(storage.concat(addon));   
    localStorage.editPos = JSON.stringify(pos + addon.length);

    window.location.reload(); // since the imported file can contain data for several stores
  }
  catch(e) {
    console.log('file import failed', e);
  }
}

class Edit {

  open() { file.click(); }
  
  load(name) {
    try {
      const storage = JSON.parse(localStorage.edit);
      const pos = JSON.parse(localStorage.editPos);
      let cpt = 0;
      for (let i = 0; i < pos; i++) {
        const item = storage[i];
        if (item.old.sid === name) {
          cpt++
          this.update(item.new);
        }        
      }
      if (cpt) console.log(name,'-', cpt, 'update(s)');  
    }
    catch(err) {
      console.log('error while loading localStorage.edit', err);
    }
  }

  dump() {
    let name = window.location.pathname.split(Config.Source)[1];
    if (!name) return;
    name = name.split('/')[0];
    let store = Source.stores[name];
    if (!store) return;
    saveAs(new Blob([JSON.stringify(store.data)], {type: 'text/plain;charset=utf-8'}), name +'.json');
  }

  saveAs() {
    const pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit).slice(0, pos);
    saveAs(new Blob([JSON.stringify(storage)], 
      {type: 'text/plain;charset=utf-8'}), 'A-' + localStorage.authorID +'.' + new Date().getTime().toString() + '.json');
  }

  create(type) {
    let name = window.location.pathname.split(Config.Source)[1];
    if (!name) return;
    name = name.split('/')[0];
    let url = '/' + name + '/edit/' + type;
    // url = url.replace(/\/\//g, '/');
    console.log('url:',url);
    B.history.push(url);
  }

  modify() {
    let url = window.location.pathname.split(itemParse);
    if (url.length === 1) return;
    const id = url[1];
    let name = url[0].split('/');
    name = name[name.length-1];

    let item = Source.get(name).getByID(id);
    if (item.sid !== name) return;
    url = '/' + name + '/edit/' + id;
    console.log('url:',url);
    B.history.push(url);
  }

  del() {
    let url = window.location.pathname.split(itemParse);
    if (url.length === 1) return;
    const id = url[1];
    let name = url[0].split('/');
    name = name[name.length-1];

    let item = Source.get(name).getByID(id);
    if (item.sid !== name) return;

    console.log('deleting', id, 'from', name);
    let old = JSON.stringify(item); // make a copy of the item
    // item.del = true;
    let cur = {sid:item.sid, ID:item.ID, del:true}
    this._push(old, cur);
    this.update(cur);
    if (B.back) B.history.go(-1);
  }
  
  _push(old, cur) { // old is the item old value stringified
    let pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit);
    storage.slice(0, pos-1); // trim storage to keep up with redo

    let pair = { old:JSON.parse(old), new:cur };
    storage.push(pair);
    localStorage.edit = JSON.stringify(storage);   
    localStorage.editPos = JSON.stringify(++pos);
  }

  undo() {
    let pos = JSON.parse(localStorage.editPos);
    if (pos) {
      localStorage.editPos = JSON.stringify(--pos);
      this.update(JSON.parse(localStorage.edit)[pos].old);  
      this._reload();
    }
  }

  redo() {
    let pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit);
    if (pos < storage.length) {
      this.update(storage[pos].new);
      localStorage.editPos = JSON.stringify(++pos);
      this._reload();
    }
  }

  reset() {
    localStorage.edit = '[]';
    localStorage.editPos = '0';
    window.location.reload(); // so that the user can see
  }

  _reload() {
    // window.location.reload();
    B.component.setState({toggle:!B.component.state.toggle});
  }

  update(item) { 
    let ids = Source.stores[item.sid].ids;
    item.del ? delete ids[item.ID] : ids[item.ID] = item;

    // update data for the search and the export
    let tmp = [];
    Object.keys(ids).forEach( (key) => tmp.push(ids[key]));
    Source.stores[item.sid].data = tmp;
  }
}

const edit = new Edit();

export default edit;