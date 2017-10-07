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

document.addEventListener("keydown", (event) => {
  if (event.altKey) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.keyCode) {
      case 65: // alt-a
        edit.dump();
        break;
      case 67: // alt-c
        edit.clipboard();
        break;
      case 68: // alt-d
        edit.create('collection');
        break;
      case 69: // alt-e
        edit.modify();
        break;
      case 78: // alt-n
        edit.create('item');
        break;
      case 79: // alt-o
        file.click();
        break;
      case 82: // alt-r
        edit.reset();
        break;
      case 83: // alt-s
        edit.saveAs();
        break;
      case 88: // alt-x
        edit.del();
        break;
      case 89: // alt-y
        edit.redo();
        break;
      case 90: // alt-z      
        edit.undo();
        break;
      default:
    }
  }
  return false;
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

  load(name) {
    try {
      const storage = JSON.parse(localStorage.edit);
      const pos = JSON.parse(localStorage.editPos);
      let cpt = 0;
      for (let i = 0; i < pos; i++) {
        const item = storage[i];
        if (item.new.sid === name) {
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

  _getName() {
    let name = window.location.pathname.split(Config.Source)[1];
    if (!name) return;
    return name.split('/')[0];
  }

  dump() {
    let name = this._getName();
    if (!name) return;
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
    let name = this._getName();
    if (!name) return;
    B.history.push('/' + name + '/edit/' + type);
  }

  _getItem() {
    let url = window.location.pathname.split(itemParse);
    if (url.length === 1) return;
    const id = url[1];
    let name = url[0].split('/');
    name = name[name.length-1];

    let item = Source.get(name).getByID(id);
    if (item.sid !== name) return;
    return { name:name, id:id, item:item }    
  }

  modify() {
    const a = this._getItem();
    if (!a) return;
    B.history.push({
      pathname: '/' + a.name + '/edit/' + a.id,
      state: { name:a.name, id:a.id }  
    });
  }

  del() {
    const a = this._getItem();
    if (!a) return;

    console.log('deleting', a.id, 'from', a.name);
    const old = JSON.stringify(a.item); // make a copy of the item
    const cur = {sid:a.item.sid, ID:a.item.ID, del:true}
    this._push(old, cur);
    this.update(cur);
    if (B.back) B.history.go(-1);
  }
  
  _push(old, cur) { // old is the item old value stringified
    let pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit);
    storage.slice(0, pos-1); // trim storage to keep up with redo

    // check if the item is not already in the list
    let found = -1;
    storage.forEach( (item, index) => {
      if (item.old.ID === cur.ID) found = index;
    });
    found = -1;
    if (found > -1) storage[found].new = cur; 
    else {
      storage.push({ old:JSON.parse(old), new:cur });
      localStorage.editPos = JSON.stringify(++pos);
    }      
    localStorage.edit = JSON.stringify(storage);   
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
    // console.log('rendering...')
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

  clipboard() {
    const item = this._getItem();
    console.log(item)
    if (item) {
      const tmp = document.createElement("input");
      document.body.appendChild(tmp);
      tmp.setAttribute("id", "dummy_id");
      tmp.setAttribute('value', item.id);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);     
    }
  }
}

const edit = new Edit();

export default edit;