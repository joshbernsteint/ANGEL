import "../App.css"
import { Button, Form, Stack, Row } from "react-bootstrap";
import { Navigate } from 'react-router-dom'
import { useRef, useState } from "react";
import axios from 'axios'



function Home(){

    return (
        <div className="home">
            <h1>Home</h1>
        </div>
    );
}

export default Home;