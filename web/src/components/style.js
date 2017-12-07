/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */


import {Config} from './../config.js';

class Style {
  applyColor(){
    var elements = document.getElementsByClassName("colorPrimary");
    console.log('ell', elements);
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.color="red";
    }
  }
}
const style = new Style();
export default style;