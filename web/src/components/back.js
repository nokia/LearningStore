/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/

import {Config} from './../config.js';

class B {
  back = false;
  set(component) {
    this.component = component;
    this.history = component.props.history;
    this.pathname = component.props.location.pathname;
    if (window.gtag && this.currentPath !== window.location.pathname) {
      this.currentPath = window.location.pathname;
      window.gtag('config', Config.trackingID);
      // console.log('ga');
    }    
  }
}

export default new B();