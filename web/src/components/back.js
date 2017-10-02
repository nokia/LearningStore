/*
  @author Gilles Gerlinger
  Copyright Nokia 2017. All rights reserved.
*/

class B {
  back = false;
  set(component) {
    this.component = component;
    this.history = component.props.history;
    this.pathname = component.props.location.pathname;
  }
}

const b = new B();

export default b;