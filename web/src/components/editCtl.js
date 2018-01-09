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
import Toast from './toast';
// import { log } from 'util';

const itemParse = /\/item\/|\/edit\//;

localStorage.authorID = localStorage.authorID || new Date().getTime().toString();
localStorage.edit = localStorage.edit || '[]';
const localify = (data, pos) => localStorage.edit = JSON.stringify(data, null, 2);
const getStorage = () => JSON.parse(localStorage.edit);
const resetStorage = () => localStorage.edit = '[]';
const editTmp = [];
const logs = [];

const gun = Config.gun ? new Gun(Config.gun) : null;
// window.gun = gun // for debugging gun

document.addEventListener("keydown", event => {
  if (event.altKey) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.keyCode) {
      case 13: // alt-enter
        edit.switchEditMode(!edit.getEditMode(), true);
        window.scrollTo(0, 0);
        break;
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
  // console.log(file.files.length)
  reader.index = -1;
  readFile();
});
const readFile = () => {
  reader.index++;
  if (reader.index < file.files.length) {
    reader.fileName = file.files[reader.index].name;
    reader.readAsText(file.files[reader.index]);
  }
}
const reader = new FileReader();
reader.onload = (file) => {
  // console.log(reader.fileName);
  edit.log('Importing file ' + reader.fileName);
  const name = edit._getName();
  if (!name) return;
  try {
    localify(importData(name, JSON.parse(reader.result), getStorage()));
  }
  catch(e) {
    edit.log('File import failed', e);
  }
  readFile(); // read next file
}

const compare = (obj1, obj2) => {
  // console.log('?', obj1, obj2)
  // if (!obj1) return false;
	for (var p in obj1) {
    // console.log(p)
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false; //Check property exists on both objects
		if (typeof obj1[p] === 'object') { //Deep compare objects
      if (!compare(obj1[p], obj2[p])) return false;
    }
    else if (obj1[p] !== obj2[p]) return false; //Compare values
  }
  // console.log('pass 1')
  for (p in obj2) { //Check object 2 for any extra properties
    // console.log(p)
    if (typeof obj1[p] === 'undefined') return false;
  }
  // console.log('pass 2')
  return true;  
}

const importData = (name, data, storage) => {
  if (!data.length) return;
  edit.log('Importing ' + data.length + ' item(s)');
  const ids = [];
  data.forEach( pair => { // reduce the list of updates: a->b then b->c becomes a->c
    if (pair.old.sid === name) {
      if (!ids[pair.old.ID]) 
        ids[pair.old.ID] = pair;
      else {
        ids[pair.old.ID].new = pair.new;
        edit.log('Import - reducing ' + pair.old.ID + ' - ' + pair.old.Title);
      }
    }
  });
  Object.keys(ids).map( id => ids[id]).forEach( pair => {
    if (pair.old.sid === name) {
      const local = Source.get(name).getByID(pair.old.ID);
      if (!local) {
        edit.log('Import - creating ' + pair.new.ID + ' - ' + pair.new.Title);
        wipC.save(pair.new.ID);
        edit.update(pair.new);
        storage.push(pair);
      }
      else if (compare(local, pair.old)) {
        if (pair.new.del)
          edit.log('Import - deleting ' + local.ID + ' - ' + local.Title);
        else {
          edit.log('Import - updating ' + local.ID + ' - ' + local.Title);
          wipC.save(local.ID);
        }
        edit.update(pair.new);
        storage.push(pair);
      }
      else if (compare(local, pair.new)) {        
        edit.log('Import - skipping ' + local.ID + ' - ' + local.Title);
      }
      else {
        edit.log('Import - refusing ' + pair.new.ID + ' - ' + pair.new.Title);        
      }  
    }
    else edit.log('Import - skipping ' + pair.old.ID + ' - ' + pair.old.Title +  ' / '  + pair.old.sid);
  });
  edit._reload();  
  return storage;
}

class Edit {
  editMode = false;
  //use case: edit an item twice - apply the change (employee.json) - reload to purge localstorage
  setEditMode(mode){
    this.editMode = mode;
  }
  getEditMode(){
    return this.editMode;
  }
  switchEditMode(forceMode, dimmer){
    // console.log('swiitch', B);
    
    if(forceMode){
      this.editMode = true;
    }else if(!forceMode){
      this.editMode = false;
    }else{
      this.editMode = !this.editMode;
    }
    if(dimmer){
      edit.dimmerEdit();
    }   

    if(this.editMode === false){
      let name = this._getName();
      if(B.pathname.split('/')[2] === "create" || B.pathname.split('/')[3] === "wip"){
        B.history.push('/' + name);
        // console.log('specific');
      }else if(B.pathname.split('/')[2] === "edit"){
        // console.log('back');
        B.history.go(-1);
      }
    }
    edit.toolbar();
  }
  dimmerEdit(){
    function fadeIn(element) {
      var op = 0.1;
      var timer = setInterval(function () {
        if (op >= 1){
          clearInterval(timer);
        }
        element.style.opacity = op;
        op = op + 0.2;
      }, 10);
    }
    function fadeOut(element, callback) {
      var op = 1;
      var timer = setInterval(function () {
        if (op <= 0){
          clearInterval(timer);
          callback();
        }
        element.style.opacity = op;
        op = op - 0.2;
      }, 10);
    }
    var el;
    
    if(this.editMode){
      document.getElementById("editDimmer").style.display = 'block';
      document.getElementById("editDimmerText").innerHTML="Welcome to edit mode!";
      document.getElementById("editDimmerImg").src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACqklEQVR4XuWb4XHbMAxGP2zQEdwNukGyQeoJ2kzQeIJmg7oTtJ6g7gRNNvAGiTdIJkAPPtEny5INUKRF0LzTD99RMt8jREGkSKikMPMXALfNMWuwNgDkWBPR3z5U8s7PzJ8B/AAQoIeQXgEsiGjdruBaADN/BfDL2IlLIlqEc9wKiIQP3D+J6EF+uBQwEj5ImMvt4E5AIniR8EpEH69ZgEiYuxMgrU4YBSuXAhJK2BQvoOntGyK67z7uUkRC0QI6gL9zSChWwEDvppawLVLAmdBOKaG8QVB5X6eScF9UBCjhw1g4VsKWiGbFCDDCp5BQTiocCT9GwoqI5E1y+pehkfAxEvbwkwtIBG+RcAA/qQAD/DuAJYDviomPUwPjbQj7yWeEjPDS8I3hnF4JQ/Iu/hQwgEjP7+BD4w3nqiVcVIAB4Ai+JeFxzO3QjYSLCUgE/wnAPwAfFOPB0YA32bR4qfAXeQqUDJ9dQOnwWQV4gM8mwAt8FgGe4JML8AafVIBH+GQCvMInEeAZfrQA7/CjBNQAHy2gFvgoATXBmwXUBm8SUCO8WkCt8CoBNcOfFVA7/EkB1wA/KOBa4HsFXBP8kQBmlg+OXxRTzqfm7ZNPXSvaE13lYF2g+fL6j+Jq8vn5vFuPmV3B90WALEJ+UwiQKgfLTx7h+wQ8AbhRCthL8ArfJ4AN8KGqbECQnRrJlqsi2hB9yn4MYGaBkHW3XEW1Vpfrz4eu2xYgGwhk60mOUiT8wS3AzBLKdxnoi4XvCpDn/7mNR1Y/RcPvBRgSIIuA4uHbAmTrmSYB0gpwAd8WYEmAzklwA98WYE2AhiS4gm8LiEmAuhLcwe8EjEiAnpt9uRI9GyKSranuigjQJEDbDqxAV1FEQF8CVEXvanpIBEhvvgEIoVxN72oE/AeLazLkUOkDDwAAAABJRU5ErkJggg==";
      el = document.getElementById("editDimmer");
      fadeIn(el);
      setTimeout(function () {
        fadeOut(el, function(){
          document.getElementById("editDimmer").style.display = 'none';
        });
      }, 800);
    }else{
      document.getElementById("editDimmer").style.display = 'block';
      document.getElementById("editDimmerText").innerHTML="Exit edit mode!";
      document.getElementById("editDimmerImg").src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABr0lEQVR4Xu3bbW7DIAwGYL8nW4+y3WQ7Sbeb7GZMVI200AQwX8HG+VNVaSP81Dh8NHDOORJ0AEDL5sIALAOsC6RqwC8RfQHwr8OPsIteWQMugZgJYPv1h0LMCDAUYmaAIRASALpCSALoAiERoCmEZIAHRO192wCCoXotaDiS6z4Zqm2wZYBlwH6yFmaUc+4O4KN0kiK+Czy7yHcpghYAnwBFCJoAihCmB0j17YMlPVYmaARgZYJWgGwEzQBZCMMBLliGj9aEFQCimbAKwCnCSgCHCKsB/AB4/z+2WAngJfjHgk3vqnwwe0vtRKUGfyXnD4NfBeA0+EsASn6+2HcSGRwNXjtAMnjNAFnBawXIDl4EQGpVODjPCl4bADt4TQBFwWsB8NPd3fCWc6sdPhLkNM5/NlUDuNezrbFAwDJg9GSIm7LWBWxzNL45ys0oK4JWBPcC3e8CtSn6krL2vIA9MGFPjLTsVr4G3Ijok4jeWl54u1btv8R6tGm3L7C96QUhBqAXhDiA1hBiAVpBiAeohVADUAqhDoALoRYgF0I9QApiGYAziOUAQggAfqg97fEH9vT2UHiK4H8AAAAASUVORK5CYII=";      
      el = document.getElementById("editDimmer");
      fadeIn(el);
      setTimeout(function () {
        fadeOut(el, function(){
          if(document.getElementById("editDimmer")){
            document.getElementById("editDimmer").style.display = 'none';
          }
        });
      }, 800);
    }
  }
  toolbar(){  
    if(this.editMode){
      document.getElementById("root").style.marginTop='150px';
      if(document.getElementById("edit")){
        document.getElementById("edit").style.display = 'block';
      }
      if(document.getElementById("editItem")){
        document.getElementById("editItem").style.display = 'block';
      }
    }else{
      if(document.getElementById("edit")){
        document.getElementById("edit").style.display = 'none';
      }
      document.getElementById("root").style.marginTop='120px';
      if(document.getElementById("editItem")){
        document.getElementById("editItem").style.display = 'none';
      }
    }
    
  }

  load(name) {
      const newStorage = [];
      const storage = getStorage();
      importData(name, storage, newStorage);
      localify(storage.filter( pair => pair.old.sid !== name).concat(newStorage)); // keep other stores data
      try {
      }
    catch(err) {
      this.log('error while loading localStorage.edit ' + err);
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
    // console.log(store.getByID('n.1489224120111'))
    saveAs(new Blob([JSON.stringify(Object.keys(store.ids).map( key => store.ids[key] )
    .filter( item => item.ID !== 'wip' && item.ID !== 'unsaved'), null, 2)], {type: 'text/plain;charset=utf-8'}), fileName);
    this.log('Saving current store in file ' + fileName);
  }

  saveAs() {
    const fileName = 'A-' + localStorage.authorID +'.' + new Date().getTime().toString() + '.json';
    saveAs(new Blob([localStorage.edit], 
      {type: 'text/plain;charset=utf-8'}), fileName);
    this.log('Saving current modifications in file ' + fileName);
  }

  create(type) {
    let url = B.pathname.split('/')[3];
    let name = this._getName();
    if (!name) return;
    if(type === "item"){
      if(url === "item"){
        Toast.set("Save before creating another item");
        Toast.display(3000);
      }else{
        B.history.push('/' + name + '/create/item');
      }
    }else if(type === "collection"){
      if(url === "collection"){
        Toast.set("Save before creating another collection");
        Toast.display(3000);
      }else{
        B.history.push('/' + name + '/create/collection');
      }
    }
  }

  _getItem() {
    let url = window.location.pathname.split(itemParse);
    if (url.length === 1) return;
    const id = url[1];
    let name = url[0].split('/');
    name = name[name.length-1];

    const item = Source.get(name).getByID(id);
    if (!item) return;
    if (item.sid !== name) return;
    return { name:name, id:id, item:item }    
  }

  modify() {
    let a = null;
    try {
      a = this._getItem();
    } catch (e) {
      // console.log('eeeeer', e);
    }
    
    // console.log('a', a);
    if (!a || a.item.ReadOnly){
      Toast.set("You can't modify this page");
      Toast.display(3000);
      return; 
    }
    B.history.push({
      pathname: '/' + a.name + '/edit/' + a.id,
      state: { name:a.name, id:a.id }  
    });
  }

  del() {
    // console.log('try del');
    const a = this._getItem();
    // console.log('del', a);
    if (!a || a.item.ReadOnly){
      Toast.set("You can't delete this page");
      Toast.display(3000);
      return; 
    }
    // console.log('deleting', a.id, 'from', a.name);
    const old = JSON.stringify(a.item); // make a copy of the item
    const cur = {sid:a.item.sid, ID:a.item.ID, del:true}
    this._push(old, cur);
    this.update(cur);
    if (B.back) B.history.go(-1);
  }
  
  _push(old, cur) { // old is the item old value stringified
    const storage = getStorage();
    storage.push({ old:JSON.parse(old), new:cur });
    localify(storage);

    if (old.del)
      this.log('Creating item '+ cur.ID + ' - ' + cur.Title);
    else if (cur.del)
      this.log('Deleting item '+ old.ID + ' - ' + old.Title);
    else
      this.log('Updating item '+ cur.ID + ' - ' + cur.Title);
  }

  undo() {
    const storage = getStorage();

    if (storage.length) {
      const item = storage.pop();
      editTmp.push(item); 
      this.update(item.old);
      localify(storage);
      this._reload();
      this.log('Undo last operation');      
    }
  }

  redo() {
    if (editTmp.length) {
      const item = editTmp.pop();
      const storage = getStorage();
      storage.push(item);
      this.update(item.new);
      localify(storage);
      this._reload();
      this.log('Redo last operation');
    }
  }

  reset() {
    resetStorage();
    window.location.reload(); // so that the user can see | clear the logs
  }

  _reload() {
    // console.log('rendering...')
    if (B.component) B.component.setState({toggle:!B.component.state.toggle});
  }

  update(item) { 
    const ids = Source.stores[item.sid].ids;
    item.del ? delete ids[item.ID] : ids[item.ID] = item;
  }

  // clipboard() {
  //   const item = this._getItem();
  //   // console.log(item);
  //   if (item) {
  //     const tmp = document.createElement("input");
  //     document.body.appendChild(tmp);
  //     tmp.setAttribute("id", "dummy_id");
  //     tmp.setAttribute('value', item.id);
  //     tmp.select();
  //     document.execCommand("copy");
  //     document.body.removeChild(tmp);     
  //   }
  // }

  log(text) { logs.push(new Date().toLocaleString() +  ' | ' + text); }

  showLog() {
    const nw = window.open();
    nw.document.write('<h3>Edit Logs</h3>');
    logs.reverse().forEach( line => nw.document.write(line + '<br />')); 
    logs.reverse();
  }

  gotoWip() {
    // if (wipC.back) {
    //   delete wipC.back;
    //   B.history.goBack();
    //   return;
    // }
    console.log('wiiip');
    const name = this._getName();
    if (!name) return;
    wipC.back = true;
    B.history.push(`/${name}/item/wip`);
  }

  upload() {
    getStorage().forEach( item => {
      const k = 'store/' + item.new.sid + '/' + localStorage.authorID + '/' + item.new.ID;
      // console.log('key', k)
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