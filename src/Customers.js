import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import CustomerDetails from './CustomerDetails'
import axios from 'axios'
import $ from "jquery";
import VideoFrame from "./VideoFrame"
import VideoFrame1 from "./VideoFrame1"

export default class Customers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedCustomer: 1, 
      counter: 0,
      context: props.context,
      video: {}
    }
  }

  //function which is called the first time the component loads
  componentDidMount() {
    this.getCustomerData();
    this.videoFrame();
  }

  //Function to get the Customer Data from json
  getCustomerData() {
    axios.get('assets/samplejson/customerlist.json').then(response => {
      this.setState({customerList: response})
    })
  };

 async videoFrame() {
    var currentFrame = $('#currentFrame');
    console.log("vidoeFrame", VideoFrame1)

    var video = new VideoFrame1({
        id : 'video',
        frameRate: 29.97,
        callback : function(frame) {
            currentFrame.html(frame);
            console.log("currentFrame",currentFrame.html(frame))
        }
    });

   await this.setState({video: video}, function () {
      console.log(this.state.video);
  });

  }

  actionClick=()=> {
    console.log("button clicked", this.state.video)
    $('#play-pause').click(function(){
      console.log("button clicked", this.state.video.video)
    /* console.log("video", video) */
        if(this.state.video.video.paused){
          this.state.video.video.play();
          this.state.video.listen('frame');
            $(this).html('Pause');
        }else{
          this.state.video.video.pause();
          this.state.video.stopListen();
            $(this).html('Play');
        }
    });
  }

  render() {
    if (!this.state.customerList)
      return (<p>Loading data</p>)
    return (<div className="addmargin">
      <div className="col-md-3">
        {

          this.state.customerList.data.map(customer => <Panel bsStyle="info" key={customer.name} className="centeralign">
            <Panel.Heading>
              <Panel.Title componentClass="h3">{customer.name}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <Button bsStyle="info" onClick={() => this.setState({selectedCustomer: customer.id})}>

                Click to View Details

              </Button>

            </Panel.Body>
          </Panel>)
        }
      </div>
      <div className="col-md-6">
        <div id="test" className="frame">  
          <span id="currentFrame">0</span>
        </div>

        <video height="150" width="100%" id="video" className="video"> 
          <source className="video_source" src="http://www.w3schools.com/html/mov_bbb.mp4"></source>
        </video>

        <div id="controls">
          <button onClick={this.actionClick} id="play-pause">Play</button>
        </div>
        <CustomerDetails val={this.state.selectedCustomer}/>
      </div>
    </div>)
  }

}
