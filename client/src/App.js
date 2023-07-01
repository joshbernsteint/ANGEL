import React from 'react'
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import MyNavbar from './components/navbar';
import Home from './components/home';
import AudioDownloader from './components/audio_downloader';
import VideoDownloader from './components/video_downloader';
import Converter from './components/converter';
import Settings from './components/settings';
import { useState, useEffect, useRef } from 'react';
import {Spinner, Modal} from 'react-bootstrap';





function App() {




  const defaultUserSettings = {
    General:{
      port: "6547"
    },
    Appearance:{
      settings_window: "General",
      is_dark_mode: false,
      mode: {background: "white", color: "black"},
      text_size: "Medium",
    },
  };


  const [port, setPort] = useState(6547);
  const [show, setShow] = useState(true);
  const [userSettings, setUserSettings] = useState(defaultUserSettings);

  const Home_Screen = () => {return (<Home userSettings={userSettings}/>)};
  const Audio_Screen = () => {return (<AudioDownloader port={port} userSettings={userSettings}/>)};
  const Video_Screen = () => {return (<VideoDownloader port={port} userSettings={userSettings}/>)};
  const Converter_Screen = () => {return (<Converter port={port} userSettings={userSettings}/>)};
  const Settings_Screen = () => {return (<Settings userSettings={userSettings} setUserSettings={setUserSettings} />)};


  function LoadingServer(){
    return (
      <Modal
          show={show}
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


  // Finds the server port for downloading images
  useEffect(()=>{
    async function findPort(){
      var curPort = 6547;
      var foundPort = false;
      
      //TODO make this not suck
      while(foundPort === false){
        await fetch(`http://localhost:${curPort}/test_connection`).then(res => {
        if(res.status === 200){
          foundPort = true;
          console.log(`Port ${curPort} made a successful connection`);
          setPort(curPort);
          setShow(false);
        }}
        ).catch(
          rejected => {
            console.log(`Port ${curPort} was not correct, trying next port now...`);
            curPort++;});
      }
    }

    findPort();
  },[]);



  return (
      <Router>
      <div className='main' style={userSettings.Appearance.mode}>
      <MyNavbar/>
        <Routes>
          <Route path="/" exact Component={ Home_Screen }/>
          <Route exact path="/audio_downloader" Component={ Audio_Screen }/>
          <Route exact path="/video_downloader" Component={ Video_Screen }/>
          <Route exact path="/converter" Component={ Converter_Screen }/>
          <Route exact path="/settings" Component={ Settings_Screen}/>
        </Routes>
      <LoadingServer/>
      </div>
    </Router>
  );
}

export default App;