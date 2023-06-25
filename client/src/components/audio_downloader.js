import "../App.css"
import { Button, Form, Stack, Modal, Accordion, OverlayTrigger, Popover, CloseButton, DropdownButton,
Dropdown } from "react-bootstrap";
import { useRef, useState } from "react";
import { convertTime  } from "../tools/utils";
import axios from 'axios'



function Audio_downloader(){

    const audioTypes = ['mp3','wav','ogg']
    const audioQuals = ['High', 'Low']

    const urlRef = useRef(null)
    const nameRef = useRef(null)
    const [show, setShow] = useState(false)
    const [nameError, setNameError] = useState(false);
    const [audioQuality, setAudioQuality] = useState('High');
    const [audioData, setAudioData] = useState({});
    const [audioType, setAudioType] = useState('mp3');
    const handleClose = () => {setNameError(true);setShow(false);}
    const handleShow = () => {setNameError(true);setShow(true);};


    
    async function downloadAudio(){
        window.open(`http://localhost:5000/audio/${audioData.id}/${audioQuality}/${nameRef.current.value}/${audioType}`)
    }

    async function getID(e){
            e.preventDefault();
            let id_response = () => {
                return new Promise(function(resolve, reject){
                    axios.get(`http://localhost:5000/get_data`,{ params: {url: urlRef.current.value}}).then(
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

    }

    function handleSubmit(e){
        e.preventDefault();
        if(nameRef.current.value === ""){
            setNameError(false)
            console.log("Error: File must have valid name")
        }
        else{
            setNameError(true);
            downloadAudio();
            handleClose();
        }
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
                keyboard={true}
                onEnter={() => document.addEventListener('keydown',(e) => {
                    if(e.key === 'Enter'){
                        handleSubmit(e);
                    }
                })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Link Parsed Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{display: "inline"}}>Title: </h5><p style={{display: "inline"}}>{audioData.title}</p><br/>
                    <h5 style={{display: "inline"}}>Length: </h5><p style={{display: "inline"}}>{convertTime(audioData.length_seconds)}</p><br/>
                    <h5 style={{display: "inline"}}>Video ID: </h5><p style={{display: "inline"}}>{audioData.id}</p><br/>
                    {(!audioData.desc) ? (<h5 style={{color: "red"}}>Description: None</h5>) : (
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><h6>Description</h6></Accordion.Header>
                                <Accordion.Body style={{margin: "2%", overflowX: "auto"}}>{audioData.desc}</Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}
                    <br/>
                    <hr/>
                    <h4>File Name</h4>
                    <Form>
                        <Form.Group>
                            <OverlayTrigger show={!nameError} defaultShow={false} placement="bottom" delay={{show:250, hide: 400}} overlay={(
                                <Popover id="popover-basic">
                                <Popover.Header as="h3" style={{color: "red"}}>File Name Error{' '}<CloseButton onClick={() => setNameError(true)}/></Popover.Header>
                                <Popover.Body>
                                  <p>Please Input a valid file name</p>
                                </Popover.Body>
                              </Popover>
                            )}>
                                <Form.Control type="text" placeholder="Enter name for file" ref={nameRef} style={{width: "50%",display: "inline"}} required autoFocus/>
                            </OverlayTrigger>
                            <DropdownButton id="dropdown-basic-button" title={`.${audioType}`} style={{width: "10%",display: "inline"}}  variant="success">
                                <Dropdown.ItemText><b>Formats</b></Dropdown.ItemText>
                                {audioTypes.map((el,i) => (
                                    <Dropdown.Item key={i} onClick={() => {setAudioType(el); }}>{el}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                            {' '}
                        </Form.Group>
                    </Form>
                    <br/>
                    <h4>Quality Options</h4>
                    {/* For choosing Video Quality */}
                    <Stack gap={2}>
                        <Stack direction="horizontal" gap={3}>
                            <h5 style={{display: "inline"}}>Audio: </h5>
                            <DropdownButton id="dropdown-basic-button" title={audioQuality} variant="info" style={{display: "inline"}}>
                                {audioQuals.map((el,i) => (
                                    <Dropdown.Item key={i} onClick={() => {setAudioQuality(el); }}>{el}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Stack>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="Submit" onClick={(e) => handleSubmit(e)}>Download</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Audio_downloader;