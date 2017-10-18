/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
 */

import {saveAs} from 'file-saver';
import Gun from 'gun';

import Source from './data';
import B from './back';
import {Config} from '../config.js';
import wipC from './editWip';

const itemParse = /\/item\/|\/edit\//;

localStorage.edit = localStorage.edit || '[]';
localStorage.editPos = localStorage.editPos || '0';
localStorage.authorID = localStorage.authorID || new Date().getTime().toString();
const localify = (data, pos) => {
  localStorage.edit = JSON.stringify(data);
  localStorage.editPos = JSON.stringify(pos || data.length);
}

const logs = [];

const gun = Config.gun ? new Gun(Config.gun) : null;
// window.gun = gun // for debugging gun

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
      case 72: // alt-h
        B.history.push('/');
        break;
      case 76: // alt-l
        edit.showLog();
        break;
      case 78: // alt-n
        edit.create('item');
        break;
      case 79: // alt-o
        edit.open();
        break;
      case 82: // alt-r
        edit.reset();
        break;
        case 83: // alt-s
        edit.saveAs();
        break;
      case 85: // alt-u
        edit.upload();
        break;
      case 87: // alt-w
        edit.gotoWip();
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
file.setAttribute("multiple", "true");
file.addEventListener('change', evt => {
  console.log(file.files.length)
  reader.index = -1;
  readFile();
});
const readFile = () => {
  reader.index++;
  if (reader.index < file.files.length) {
    reader.fileName = file.files[reader.index].name;
    reader.readAsText(file.files[reader.index]);
  }
  // else if (reader.conflicts) window.alert('Conflicts detected. Please check the logs');
  // else {
  //   window.alert('The application is about to reload.\nCurrent logs:\n' + 
  //     JSON.stringify(logs).replace(/","/g, '"\n"').replace(/\[|\]|"|\\/g, ''));
  //   window.location.reload(); // since the imported file can contain data for several stores
  // }
}
const reader = new FileReader();
reader.onload = (file) => {
  console.log(reader.fileName);
  edit.log('Importing file ' + reader.fileName);
  let pos = JSON.parse(localStorage.editPos);  
  const storage = JSON.parse(localStorage.edit).slice(0, pos);
  try {
    const addon = JSON.parse(reader.result);
    const name = edit._getName();
    addon.forEach( pair => {
      if (pair.old.sid === name) {
        const local = Source.get(name).getByID(pair.old.ID);
        if (compare(local, pair.old)) {
          storage.push(pair);
          pos++;
          if (pair.new.del)
            edit.log('Import - deleting ' + local.ID + ' - ' + local.Title);
          else {
            edit.log('Import - updating ' + local.ID + ' - ' + local.Title);
            wipC.save(local.ID);
          }
          edit.update(pair.new);
        }
        else if (compare(local, pair.new)) {        
          edit.log('Import - skipping ' + local.ID + ' - ' + local.Title);
        }
        else {
          edit.log('Import - refusing ' + pair.new.ID + ' - ' + pair.new.Title);        
        }  
      }
    });
    localify(storage, pos);

/*
    const newIDs = addon.map( pair => pair.new.ID );
    const conflicts = storage.filter( pair => newIDs.indexOf(pair.new.ID) > -1 ).map( pair => pair.new.ID );
    const passed = addon.filter( pair => conflicts.indexOf(pair.new.ID) === -1 );
    if (conflicts.length) {
      const IDs = JSON.stringify(conflicts);
      edit.log('Found conflicts on IDs: ' + IDs)
      reader.conflicts = true;
    }

    if (passed.length) {
      localStorage.edit = JSON.stringify(storage.concat(passed));   
      localStorage.editPos = JSON.stringify(pos + passed.length);
      edit.log('Item(s) successfully imported: ' + JSON.stringify(passed.map( pair => pair.new.ID )));  
    }
*/    
  }
  catch(e) {
    edit.log('File import failed', e);
  }
  readFile(); // read next file
}

const compare = (obj1, obj2) => {
  // console.log('?', obj1, obj2)
	for (var p in obj1) {
    // console.log(p)
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false; //Check property exists on both objects
		if (typeof obj1[p] === 'object') { //Deep compare objects
      if (!compare(obj1[p], obj2[p])) return false;
    }
    else if (obj1[p] !== obj2[p]) return false; //Compare values
  }
  // console.log('pass 1');
  for (p in obj2) { //Check object 2 for any extra properties
    // console.log(p);
    if (typeof obj1[p] === 'undefined') return false;
  }
  // console.log('pass 2');
  return true;  
}

class Edit {

  load(name) {
    try {
      const newStorage = [];
      const storage = JSON.parse(localStorage.edit);
      const pos = JSON.parse(localStorage.editPos);
      this.log('Found ' + pos + ' local update(s)');
      for (let i = 0; i < pos; i++) {
        const item = storage[i];
        if (item.new.sid === name) {
          const local = Source.get(name).getByID(item.new.ID);
          // if (local === JSON.stringify(item.old)) {
          if (compare(local, item.old)) {
            if (item.new.del)
              this.log('Applying local update: deleting ' + item.new.ID + ' - ' + item.old.Title);
            else {
              this.log('Applying local update ' + item.new.ID + ' - ' + item.new.Title);
              wipC.save(item.new.ID);
            }
            this.update(item.new);
            newStorage.push(item); // keep this 
          } 
          else if (compare(local, item.new)) { // store has been updated accordingly
            this.log('Store updated: discarding local update ' + item.new.ID + ' - ' + item.old.Title);
          }
          else {
            this.log('Rejecting conflicting item ' + item.new.ID + ' - ' + item.new.Title);
            newStorage.push(item); // keep this 
          }
        }        
      }
      if (newStorage.length < pos) {
        this.log('Updating pending modifications');
        localify(newStorage);
      }
    }
    catch(err) {
      this.log('error while loading localStorage.edit', err);
    }
  }

  open() { if (this._getName()) file.click(); }

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
    const fileName = name +'.json';
    console.log(store.getByID('n.1489224120111'))
    saveAs(new Blob([JSON.stringify(Object.keys(store.ids).map( key => store.ids[key] )
    .filter( item => item.ID !== 'wip' && item.ID !== 'unsaved'), null, 2)], {type: 'text/plain;charset=utf-8'}), fileName);
    this.log('Saving current store in file ' + fileName);
  }

  saveAs() {
    const pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit).slice(0, pos);
    const fileName = 'A-' + localStorage.authorID +'.' + new Date().getTime().toString() + '.json';
    saveAs(new Blob([JSON.stringify(storage, null, 2)], 
      {type: 'text/plain;charset=utf-8'}), fileName);
    this.log('Saving current modifications in file ' + fileName);
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

    const item = Source.get(name).getByID(id);
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
    let storage = JSON.parse(localStorage.edit).slice(0, pos); // trim storage to keep up with redo

    storage.push({ old:JSON.parse(old), new:cur });
    // localStorage.editPos = JSON.stringify(++pos);
    // localStorage.edit = JSON.stringify(storage);
    localify(storage);

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
    let ids = Source.stores[item.sid].ids;
    item.del ? delete ids[item.ID] : ids[item.ID] = item;
    // Source.stores[item.sid].data = Object.keys(ids).map( key => ids[key]);
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
    logs.reverse().forEach( line => nw.document.write(line + '<br />')); 
  }

  gotoWip() {
    if (wipC.back) {
      delete wipC.back;
      B.history.goBack();
      return;
    }
    const name = this._getName();
    if (!name) return;
    wipC.back = true;
    B.history.push(`/${name}/item/wip`);
  }

  upload() {
    const pos = JSON.parse(localStorage.editPos);
    let storage = JSON.parse(localStorage.edit).slice(0, pos);
    storage.forEach( item => {
      const k = 'store/' + item.new.sid + '/' + localStorage.authorID + '/' + item.new.ID;
      console.log('key', k)
      gun.get('store/updates').set(
        gun.get(k).put({ v:JSON.stringify(item) })
      );
      logs.push('uploading key ' + k);
    });
  }
}

const edit = new Edit();
edit.log('Started');
export default edit;