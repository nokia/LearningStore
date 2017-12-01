/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */



class Toast {
  message;
  fadeIn(element) {
    var op = 0.1;
    var timer = setInterval(function () {
      if (op >= 1){
        clearInterval(timer);
      }
      element.style.opacity = op;
      op = op + 0.2;
    }, 10);
  }
  fadeOut(element, callback) {
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
  set(text){
    this.message = text;
  }
  display(ms){
    var self = this;
    var el = document.getElementById("toast");
    el.style.display = 'block';
    document.getElementById("toast_msg").innerHTML= this.message;
    self.fadeIn(el);
    setTimeout(function () {
      self.fadeOut(el, function(){
        el.style.display = 'none';
      });
    }, ms);
  }
  hide(){

  }
  reset(){
    this.message = "";
  }
}
const toast = new Toast();
export default toast;