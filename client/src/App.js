import React from 'react'
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav_bar from './components/navbar';
import "./App.css"
import Home from './components/home';
import Audio_downloader from './components/audio_downloader';
import Video_downloader from './components/video_downloader';
import Converter from './components/converter';
import Settings from './components/settings';


const Home_Screen = () => {return (<Home/>)};
const Audio_Screen = () => {return (<Audio_downloader/>)};
const Video_Screen = () => {return (<Video_downloader/>)};
const Converter_Screen = () => {return (<Converter/>)};
const Settings_Screen = () => {return (<Settings/>)};

function App() {
  return (
      <Router>
      <div className='main'>
      <Nav_bar/>
        <Routes>
          <Route path="/" exact Component={ Home_Screen }/>
          <Route exact path="/audio_downloader" Component={ Audio_Screen }/>
          <Route exact path="/video_downloader" Component={ Video_Screen }/>
          <Route exact path="/converter" Component={ Converter_Screen }/>
          <Route exact path="/settings" Component={ Settings_Screen}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
