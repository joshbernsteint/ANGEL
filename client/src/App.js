import React from 'react'
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import Navbar from './components/navbar';
import Home from './components/home';
import AudioDownloader from './components/audio_downloader';
import VideoDownloader from './components/video_downloader';
import Converter from './components/converter';
import Settings from './components/settings';
import { useState, useEffect } from 'react';
import {Spinner, Modal} from 'react-bootstrap'


function LoadingServer(){
  return (
    <Modal
        show={true}
        animation={false}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header>
          <Modal.Title>Hold up a second!</Modal.Title>
        </Modal.Header>
        <Modal.Body className='spinner_container'>
          <Spinner animation="grow" variant="primary" className='loading_spinner'style={{zIndex: "1"}}/>
          <Spinner animation="border" variant="primary" className='loading_spinner' style={{zIndex: "2"}}/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <h3>We're trying to connect to the internal server, it'll just be a moment!</h3>
        </Modal.Body>
        <Modal.Footer className='spinner_footer'>
          <h5>Thank you for your patience</h5>
        </Modal.Footer>
      </Modal>
  );
}


function App() {


  const [port, setPort] = useState(6547);
  const [hasPort, setHasPort]= useState(false);

  const Home_Screen = () => {return (<Home/>)};
  const Audio_Screen = () => {return (<AudioDownloader port={port}/>)};
  const Video_Screen = () => {return (<VideoDownloader port={port}/>)};
  const Converter_Screen = () => {return (<Converter port={port}/>)};
  const Settings_Screen = () => {return (<Settings/>)};

  
  //Finds the server port for downloading images
  useEffect(()=>{
    async function findPort(){
      var curPort = port;
      var foundPort = false;
      
      //TODO make this not suck
      while(foundPort === false){
        await fetch(`http://localhost:${curPort}/test_connection`).then(res => {
        if(res.status === 200){
          foundPort = true;
          console.log(`Port ${curPort} made a successful connection`);
          setPort(curPort);
          setHasPort(!hasPort);
        }}
        ).catch(
          rejected => {
            console.log(`Port ${curPort} was not correct, trying next port now...`);
            curPort++;});
      }
    }

    findPort();
  },[]);

  // useEffect(() => {
  //   console.log(port);
  // },[port]);

  return (
      <Router>
      <div className='main'>
      <Navbar/>
        <Routes>
          <Route path="/" exact Component={ Home_Screen }/>
          <Route exact path="/audio_downloader" Component={ Audio_Screen }/>
          <Route exact path="/video_downloader" Component={ Video_Screen }/>
          <Route exact path="/converter" Component={ Converter_Screen }/>
          <Route exact path="/settings" Component={ Settings_Screen}/>
        </Routes>
      {hasPort ? <h1>Have it!</h1>: <LoadingServer/>}
      </div>
    </Router>
  );
}

export default App;
