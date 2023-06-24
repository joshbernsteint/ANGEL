import React from 'react'
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  createHashRouter,
  RouterProvider
} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Nav_bar from './components/navbar';
import "./App.css"
import Home from './components/home';
import Audio_downloader from './components/audio_downloader';
import Video_downloader from './components/video_downloader';
import Converter from './components/converter';
import Settings from './components/settings';


const router = createHashRouter([
  {
    path: "/*",
    element: <Home />,
  },
  {
    path: "/audio_downloader",
    element: <Audio_downloader/>,
  },
]);

function App() {
  return (
    <div className='main'>
      <Nav_bar/>
      {/* <RouterProvider router={router}/> */}
      <Router basename={process.env.PUBLIC_URL + "/"}>
        <Routes>
          <Route path="/" exact Component={ Home }/>
          <Route path="/audio_downloader" Component={ Audio_downloader }/>
          <Route path="/video_downloader" Component={ Video_downloader }/>
          <Route path="/converter" Component={ Converter }/>
          <Route path="/settings" Component={ Settings}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
