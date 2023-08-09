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
import { useState, useEffect } from 'react';
import {Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';


const defaultUserSettings = {
  General:{
    port: 6547,
    custom_port: false,
    default_page: "None",
  },
  Appearance:{
    settings_window: "General",
    is_dark_mode: true,
    text_size: "Medium",
  },
  Downloads:{
    show_popup: true,
    download_type: "prompt",
    download_path: "",
  },
  Converter:{
    show_popup: true,
  },
};


/**
 * Parses a JSON object to be equivalent to a stylesheet
 * @param {*JSON} settings 
 * @returns A Parsed JSON object
 */
function parseSettings(settings){
  var style = {
  };
    if(settings.Appearance.is_dark_mode == true){
      style = {...style, background: "black", color: "white"};
    }
    else{
      style = {...style, background: "white", color: "black"};
    }

    const font_size = `${settings.Appearance.text_size}`.toLowerCase();
    style = {...style, fontSize: font_size}
  return style
}


function App() {


  const [port, setPort] = useState(6547);
  const [show, setShow] = useState(true);
  const [changeCount, setChangeCount] = useState(-1);
  const [userSettings, setUserSettings] = useState(defaultUserSettings);
  
  const parsedSettings = parseSettings(userSettings);
  const Home_Screen = () => {return (<Home userSettings={userSettings}/>)};
  const Audio_Screen = () => {return (<AudioDownloader port={port} userSettings={userSettings}/>)};
  const Video_Screen = () => {return (<VideoDownloader port={port} userSettings={userSettings}/>)};
  const Converter_Screen = () => {return (<Converter port={port} userSettings={userSettings}/>)};
  const Settings_Screen = () => {return (<Settings userSettings={userSettings} setUserSettings={setUserSettings} default={defaultUserSettings} />)};


  useEffect(() => {
    async function setSettings(){
        let settings_response = () => {
          return new Promise(function(resolve, reject){
              axios.get(`http://localhost:${port}/apply_settings`,{ params: {settings: userSettings}}).then(
                  response => resolve(response)
              );
          });
      }
      let responseData = await settings_response();
      let settings_data = responseData.data
      console.log(settings_data);
    }


    if(changeCount > 0){
      setSettings();
    }
    setChangeCount(changeCount+1);
  
  }, [userSettings]);



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
    const localPort = JSON.parse(localStorage.getItem('port'));
    if(localPort === null){
      localStorage.setItem('port',defaultUserSettings.General.port);
      localPort = defaultUserSettings.General.port;
    }
    var curPort = localPort;
    var foundPort = false;

    async function findPort(){
      while(foundPort === false){
        await fetch(`http://localhost:${curPort}/test_connection`).then(res => {
          if(res.status === 200){
            console.log(`Port ${curPort} made a successful connection`);
            setPort(curPort);
            setShow(false);
            if(curPort != localPort){
              setUserSettings({...userSettings,General: {...userSettings.General, port: curPort}});
              localStorage.setItem('port',JSON.stringify(curPort));
            }
            foundPort = true;
          }}
          ).catch(
            rejected => {
              console.log(`Port ${curPort} was not correct, trying next port now...`);
              curPort++;
              });
      }
    }
      
    

    async function wrapper(){

        await findPort();
        await fetch(`http://localhost:${curPort}/get_settings`).then(res => {return res.json()}).then(obj => {
          if('error' in obj){
            setUserSettings(defaultUserSettings)
            console.log('Catching server default settings failed, using set defaults');
          }
          else{
            setUserSettings({...obj,General: {...obj.General, custom_port: (obj.General.custom_port == "true"), port: curPort}, Appearance: {...obj.Appearance, is_dark_mode: (obj.Appearance.is_dark_mode == "true")}});
          }
          

        });
    }
     wrapper();
     console.log(userSettings);
  }, []);


  return (
      <div className='main' style={parsedSettings}>
      <Router>
      <MyNavbar settings={userSettings}/>
        <Routes>
          <Route path="/" exact Component={ Home_Screen }/>
          <Route exact path="/audio_downloader" Component={ Audio_Screen }/>
          <Route exact path="/video_downloader" Component={ Video_Screen }/>
          <Route exact path="/converter" Component={ Converter_Screen }/>
          <Route exact path="/settings" Component={ Settings_Screen}/>
        </Routes>
      <LoadingServer/>
    </Router>
      </div>
  );
}

export default App;