/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import {saveAs} from 'file-saver';

import Source from './data';
import B from './back';
import {Config} from '../config.js';

const itemParse = /\/item\/|\/edit\//;

localStorage.edit = localStorage.edit || '[]';
localStorage.editPos = localStorage.editPos || '0';
localStorage.authorID = localStorage.authorID || new Date().getTime().toString();

const logs = [];

document.addEventListener("keydown", event => {
  if (event.altKey) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.keyCode) {
      case 67: // alt-c
        edit.clipboard();
        break;
      case 68: // alt-d
        edit.dump();
        break;
      case 69: // alt-e
        edit.modify();
        break;
      case 70: // alt-f
        edit.create('collection');
        break;
      case 76: // alt-l
        edit.showLog();
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
file.addEventListener('change', evt => reader.readAsText(file.files[0]) );
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
      this.log('Found ' + pos + ' local update(s)');
      for (let i = 0; i < pos; i++) {
        const item = storage[i];
        if (item.new.sid === name) {
          if (item.new.del)
            this.log('Applying local update: deleting ' + item.new.ID + ' - ' + item.old.Title);
          else
            this.log('Applying local update ' + item.new.ID + ' - ' + item.new.Title);
          this.update(item.new);
        }        
      }
    }
    catch(err) {
      this.log('error while loading localStorage.edit', err);
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

    old = JSON.parse(old);
    storage.push({ old:old, new:cur });
    localStorage.editPos = JSON.stringify(++pos);
    localStorage.edit = JSON.stringify(storage);

    if (old.del)
      this.log('Creating item '+ cur.ID + ' - ' + cur.Title);
    else if (cur.del)
      this.log('Deleting item '+ old.ID + ' - ' + old.Title);
    else
      this.log('Updating item '+ cur.ID + ' - ' + cur.Title);
  }

  undo() {
    let pos = JSON.parse(localStorage.editPos);
    if (pos) {
      localStorage.editPos = JSON.stringify(--pos);
      this.update(JSON.parse(localStorage.edit)[pos].old);
      this._reload();
      this.log('Undo last operation');
    }
  }

  redo() {
    let pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit);
    if (pos < storage.length) {
      this.update(storage[pos].new);
      localStorage.editPos = JSON.stringify(++pos);
      this._reload();
      this.log('Redo last operation');
    }
  }

  reset() {
    localStorage.edit = '[]';
    localStorage.editPos = '0';
    window.location.reload(); // so that the user can see | clear the logs
  }

  _reload() {
    // console.log('rendering...')
    B.component.setState({toggle:!B.component.state.toggle});
  }

  update(item) { 
    // if (item.del)
    //   this.log('Deleting item '+ item.ID + ' - ' + item.Title);
    // else 
    //   this.log('Creating/Updating item '+ item.ID + ' - ' + item.Title);

    let ids = Source.stores[item.sid].ids;
    item.del ? delete ids[item.ID] : ids[item.ID] = item;

    // update data for the search and the export
    let tmp = [];
    Object.keys(ids).forEach( key => tmp.push(ids[key]));
    Source.stores[item.sid].data = tmp;
  }

  clipboard() {
    const item = this._getItem();
    console.log(item);
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

  log(text) { logs.push(new Date().toLocaleString() +  ' | ' + text); }

  showLog() {
    const nw = window.open();
    nw.document.write('<h3>Edit Logs</h3>');
    logs.forEach( line => nw.document.write(line + '<br />')); 
  }
}

const edit = new Edit();
edit.log('Started');
export default edit;