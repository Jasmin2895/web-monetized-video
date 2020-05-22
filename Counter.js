import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import Page from '../../../layouts/Page'
import $ from "jquery";
import  VideoFrame from "./VideoFrame"

// ----------------------------------------
// Nav Items
// ----------------------------------------
const navItemLeft = <button className={'btn btn-clear btn-icon'}>
  <i className={'ion ion-ios-arrow-left'}></i>
</button>

// ----------------------------------------
// Nav Item Handlers
// ----------------------------------------
const onNavItemLeftClick = () => {
  browserHistory.goBack()
}

// ----------------------------------------
// Page Content Component
// ----------------------------------------
class MyCounter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0,
      video: {}
    }
  }

  componentDidMount() {
    let costPerFrame= 0.0003
    var currentFrame = $('#currentFrame');
    console.log(new VideoFrame(),currentFrame)
    var video =  new VideoFrame({
        id : 'video',
        frameRate: 29.97,
        callback : function(frame) {
          console.log("frame", frame*costPerFrame)
          // calculated total number of frames played
            currentFrame.html(frame);
        }
    });
    $('#play-pause').click(function(){
      console.log("button click event")
      if(video.video.paused){
          video.video.play();
          video.listen('frame');
          $(this).html('Pause');
      }else{
          video.video.pause();
          video.stopListen();
          $(this).html('Play');
      }
  });
  }

  increase() {
    this.setState({
      counter: this.state.counter + 1
    })
  }

  render() {
    return (
      <div className={'page-content padding-horizontal'}>
        <p>Counter: {this.state.counter}</p>
        <button className={'btn btn-danger'} onClick={this.increase.bind(this)}>点击</button>
        <div className="frame">  
          <span id="currentFrame">0</span>
        </div>

        <video height="150" width="100%" id="video" controls="controls"  >
          <source src="https://www.html5rocks.com/en/tutorials/video/basics/Chrome_ImF.webm"/>
        </video>

        <div id="controls">
          <button id="play-pause">Play</button>
        </div>
      </div>
    )
  }
}

const Counter = () => (
  <Page title={'Counter'}
        navItemLeft={navItemLeft}
        onNavItemLeftClick={onNavItemLeftClick}
        content={ <MyCounter /> } />
)

export default Counter
