import "../App.css"
import { Button, Form, Stack, Modal, Accordion, OverlayTrigger, Popover, CloseButton, DropdownButton,
Dropdown, Toast, ToastContainer } from "react-bootstrap";
import { useRef, useState } from "react";
import { convertTime  } from "../tools/utils";
import axios from 'axios'

function AudioDownloader(props){

    const audioTypes = ['mp3','wav','ogg']
    const audioQuals = ['High', 'Low']

    const urlRef = useRef(null)
    const nameRef = useRef(null)
    const [show, setShow] = useState(false);
    const [fileName, setFileName] = useState("");
    const [showNotification, setNotification] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [audioQuality, setAudioQuality] = useState('High');
    const [audioData, setAudioData] = useState({});
    const [audioType, setAudioType] = useState('mp3');

    function handleSubmit(e){
        e.preventDefault();
        if(nameRef.current.value === ""){
            setNameError(false)
            console.log("Error: File must have valid name")
        }
        else{
            setNameError(true);
            handleClose();
            downloadAudio();
        }
    }
    

    const handleClose = () => {setNameError(true);setShow(false);}
    const handleShow = () => {setNameError(true);setShow(true);};


    async function downloadAudio(){
        setFileName(`${nameRef.current.value}.${audioType}`)
        fetch(`http://localhost:${props.port}/audio/${audioData.id}/${audioQuality}/${nameRef.current.value}/${audioType}`).then(res => {
            if(res.status==200){
                console.log(`${fileName} downloaded.`);
                setNotification(true);
            }
            else{
                console.log('ERROR IN AUDIO DOWNLOAD');
            }
        })
    }

    async function getData(e){
            e.preventDefault();
            let id_response = () => {
                return new Promise(function(resolve, reject){
                    axios.get(`http://localhost:${props.port}/get_data`,{ params: {url: urlRef.current.value}}).then(
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


    

    

    return (
        <div className="home">
            <h1>Audio Downloader</h1>
            <Form onSubmit={getData} className="form">
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

            <ToastContainer position="middle-end">
                <Toast onClose={() => setNotification(false)} show={showNotification} delay={3000} autohide bg="success">
                    <Toast.Header>
                        ✅
                        <strong className="me-auto">Download Successful!</strong>
                    </Toast.Header>
                    <Toast.Body>Audio file: {fileName} has been downloaded. This message will disappear in 3 seconds.</Toast.Body>
                </Toast>
            </ToastContainer>


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
                onSubmit={e => e.preventDefault()}
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
                                <Accordion.Body style={{margin: "2%", overflowX: "auto", whiteSpace: "pre-wrap"}}>{audioData.desc}</Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}
                    <br/>
                    <hr/>
                    <h4>File Name</h4>
                    <Form onSubmit={(e) => {e.preventDefault();console.log('default prevented!');}}>
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
                            <DropdownButton id="dropdown-basic-button" title={`.${audioType}`} style={{width: "10%",display: "inline"}}  variant="success" onSubmit={(e) => e.preventDefault()}>
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
                <Button variant="primary" type="Submit" onClick={(e) => handleSubmit(e)} onSubmit={handleSubmit} id="download">Download</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AudioDownloader;