/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/

import {Config} from '../config.js';

// TD: do not dump those items

class Wip {
  constructor(arg) { Object.assign(this, arg); }

  save(id) { 
    // console.log('pushing', id, 'to', this.ID);
    if (this.indexOf(id) === -1) this.Solutions.push(id); 
    if (this.unsaved) this.unsaved.remove(this.unsaved.indexOf(id));
  }
  unsave(id) { if (this.unsaved) this.unsaved.save(id); }
  indexOf = (id) => this.Solutions.indexOf(id) 
  remove(i) { if (i > -1) this.Solutions[i] = ''; }

  stay() {
    if (!this.unsaved) return 0;
    const ret = this.unsaved.Solutions.filter( id => id ).length;
    this.unsaved.Icon = ret ? Config.defaultIcon : null;
    return ret;
  }
}

// console.log('wiiiiip');
const wip   = new Wip({ ID:'wip', Title: '__W.I.P__', Description:'Shows work in progress', Solutions:['unsaved'], Icon:Config.defaultIcon });
wip.unsaved = new Wip({ ID:'unsaved', Title: 'Unsaved Items*', 
  Description:'Items modified but not saved', Solutions:[]});

export default wip;
