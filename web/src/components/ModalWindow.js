/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react'

export default class ModalWindow extends Component{
  op;
  state = { open: false }


  open = () => this.setState({ open: true })
  close = () => this.op = false;

  componentWillMount(){
    this.op = this.props.open;
  }
  render() {
    
    return (
      <Modal
        open={this.op}
        onClose={this.close}
        closeOnEscape={true}
        closeOnRootNodeClick={true}
        closeIcon
      >
      <Modal.Header>
        titre
      </Modal.Header>
      <Modal.Content image>
        image
        <Modal.Description>
          desc
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <a className="itemLaunch" href="" title="Launch" target="_blank">
          <Button primary>
            Launch <Icon name='right chevron' />
          </Button>
        </a>
      </Modal.Actions>
      </Modal>
    )
  }
}