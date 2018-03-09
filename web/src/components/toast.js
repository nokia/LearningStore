/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */



class Toast {
  message;
  available = true;
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
  display(ms, color){
    var self = this;

    if(!this.available){
      setTimeout(function () {
        self.display(ms, color);
      }, 20);
      return;
    }
    // console.log('toast', this.available);
    var el = document.getElementById("toast");
    el.style.display = 'block';
    document.getElementById("toast_msg").innerHTML= this.message;
    if(color === "red"){
      document.getElementById("toast_msg").className = "red_toast";
    }else if(color === "green"){
      document.getElementById("toast_msg").className = "green_toast";
    }
    

    self.fadeIn(el);
    self.available = false;
    setTimeout(function () {
      self.fadeOut(el, function(){
        el.style.display = 'none';
        self.available = true;
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