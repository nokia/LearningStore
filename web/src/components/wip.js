/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/

import {Config} from '../config.js';

class Wip {
  constructor(arg) { Object.assign(this, arg); }
  push(id) { if (this.Solutions.indexOf(id) === -1) this.Solutions.push(id); }
}
const wip = new Wip({ ID:'wip', Title: '__W.I.P__', Description:'Shows work in progress', Solutions:[], Icon:Config.defaultIcon });

export default wip;
