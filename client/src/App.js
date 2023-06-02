import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from './components/home';
import "bootstrap/dist/css/bootstrap.min.css";
import Nav_bar from './components/navbar';
import "./App.css"
import Audio_downloader from './components/audio_downloader';
import Video_downloader from './components/video_downloader';
import Converter from './components/converter';

function App() {
  return (
    <div className='main'>
      <Nav_bar/>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/audio_downloader" element={<Audio_downloader/>}/>
          <Route path="/video_downloader" element={<Video_downloader/>}/>
          <Route path="/converter" element={<Converter/>}/>
          <Route path = "*" element = {<Navigate to = "/" />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
