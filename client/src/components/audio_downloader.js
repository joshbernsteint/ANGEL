import "../App.css"
import { Button, Form, Stack, Modal, Accordion } from "react-bootstrap";
import { Navigate } from 'react-router-dom'
import { useRef, useState } from "react";
import { convertTime  } from "../tools/utils";
import axios from 'axios'




function Audio_downloader(){


    const urlRef = useRef(null)
    const [show, setShow] = useState(false)
    const [nameError, setNameError] = useState(false);
    const [audioData, setAudioData] = useState({});
    const handleClose = () => {setNameError(true);setShow(false);}
    const handleShow = () => {setNameError(true);setShow(true);};


    async function getID(e){
            e.preventDefault();
            let id_response = () => {
                return new Promise(function(resolve, reject){
                    axios.get(`http://192.168.1.226:5000/get_data`,{ params: {url: urlRef.current.value}}).then(
                        response => resolve(response)
                    );
                });
            }
            let responseData = await id_response();
            let video_data = responseData.data
            if(video_data.error){
                console.log("Error: "+video_data.error)
                //TODO: Handle error
            }
            else{
                setAudioData(video_data);
                handleShow()
            }
        // window.open(`http://localhost:5000/audio/${video_data.id}/high`)

    }

    return (
        <div className="home">
            <h2>YTOOO</h2>
            <h3>-----</h3>
            <h1>Audio Downloader</h1>
            <Form onSubmit={getID} className="form">
                <Form.Group>
                    <Form.Label>URL to Audio</Form.Label>
                    <Stack direction="horizontal" gap={3}>
                        <Form.Control type="url" placeholder="Enter URL" ref={urlRef} className="form_input"/>
                        <Button type="Submit" className="form_button">
                            Parse Link
                        </Button>
                    </Stack>
                </Form.Group>
            </Form>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Link Parsed Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{display: "inline"}}>Title: </h5><p style={{display: "inline"}}>{audioData.title}</p><br/>
                    <h5 style={{display: "inline"}}>Length: </h5><p style={{display: "inline"}}>{convertTime(audioData.length_seconds)}</p><br/>
                    <h5 style={{display: "inline"}}>Video ID: </h5><p style={{display: "inline"}}>{audioData.id}</p><br/>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Audio_downloader;