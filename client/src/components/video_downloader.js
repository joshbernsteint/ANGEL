import "../App.css"
import { Button, Form, Stack, Modal, Accordion, Dropdown, DropdownButton, OverlayTrigger, Popover, CloseButton,
Toast, ToastContainer } from "react-bootstrap";
import { useRef, useState } from "react";
import { convertTime } from "../tools/utils";
import axios from 'axios'





function VideoDownloader(props){
    const urlRef = useRef(null);
    const nameRef = useRef(null);

    const [videoData, setVideoData] = useState({});
    const [fileName, setFileName] = useState("");
    const [showNotification, setNotification] = useState(false);
    const [show, setShow] = useState(false)
    const [videoType, setVideoType] = useState('mp4');
    const [qualityOptions, setQualityOptions] = useState({});
    const [videoQuality, setVideoQuality] = useState('')
    const [itag, setItag] = useState(0);
    const [nameError, setNameError] = useState(false);
    const [audioQuality, setAudioQuality] = useState('High')


    const handleClose = () => {setNameError(true);setShow(false);}
    const handleShow = () => {setNameError(true);setShow(true)};





    async function downloadVideo(){
        setFileName(`${nameRef.current.value}.${videoType}`)
        fetch(`http://localhost:${props.port}/video/${videoData.id}/${itag}/${nameRef.current.value}/${videoType}/${audioQuality}`).then(res => {
            if(res.status===200){
                console.log(`Video ${fileName} downloaded!`);
                setNotification(true);
            }
            else{
                console.log('ERROR IN Video DOWNLOAD');
            }
        })
    }

    async function getVideoData(e){
        e.preventDefault()
        let data_response = () => {
            return new Promise(function(resolve, reject){
                axios.get(`http://localhost:${props.port}/get_data`,{ params: {url: urlRef.current.value}}).then(
                    response => resolve(response)
                );
            });
        }
        let responseData = await data_response();
        let video_data = responseData.data
        setVideoData(video_data)
        if(video_data.error){
            console.log("Error: "+video_data.error)
            //TODO: Handle error
        }
        else{
            //Getting diffferent quality options
            let w_options = [];
            let m_options = [];
            video_data.video_options.forEach((element) => {
                const v_quality = element.quality;
                const itag = element.itag
                const type = element.video_type;
                if(type === 'webm'){
                    w_options.push({quality: v_quality, itag: itag})
                }
                else{
                    m_options.push({quality: v_quality, itag: itag})
                }
            })
            setVideoQuality(m_options[0].quality);
            setItag(m_options[0].itag);
            setQualityOptions({mp4: m_options, webm: w_options});
            handleShow();
            
        }
    }

    return (
        <div className="home">
            <h1>Video downloader</h1>
            <Form onSubmit={getVideoData} className="form">
                <Form.Group>
                    <Form.Label>Video URL</Form.Label>
                    <Stack direction="horizontal" gap={3}>
                        <Form.Control type="url" placeholder="Enter Video URL" ref={urlRef} className="form_input"/>
                        <Button type="Submit" className="form_button">
                            Parse Link
                        </Button>
                    </Stack>
                </Form.Group>
            </Form>

            <ToastContainer position="top-end">
                <Toast onClose={() => setNotification(false)} show={showNotification} delay={3000} autohide bg="success">
                    <Toast.Header>
                        ✅
                        <strong className="me-auto">Download Successful!</strong>
                    </Toast.Header>
                    <Toast.Body>Video file: {fileName} has been downloaded. This message will disappear in 3 seconds.</Toast.Body>
                </Toast>
            </ToastContainer>


             <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                >
                <Modal.Header closeButton style={props.userSettings.Appearance.mode}>
                    <Modal.Title>Link Parsed Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body style={props.userSettings.Appearance.mode}>
                    <h5 style={{display: "inline"}}>Title: </h5><p style={{display: "inline"}}>{videoData.title}</p><br/>
                    <h5 style={{display: "inline"}}>Length: </h5><p style={{display: "inline"}}>{convertTime(videoData.length_seconds)}</p><br/>
                    <h5 style={{display: "inline"}}>Video ID: </h5><p style={{display: "inline"}}>{videoData.id}</p><br/>
                    {(!videoData.desc) ? (<h5 style={{color: "red"}}>Description: None</h5>) : (
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><h6>Description</h6></Accordion.Header>
                                <Accordion.Body style={{margin: "2%", overflowX: "auto",whiteSpace: "pre-wrap"}}>{videoData.desc}</Accordion.Body>
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
                            <DropdownButton id="dropdown-basic-button" title={`.${videoType}`} style={{width: "10%",display: "inline"}}  variant="success">
                                <Dropdown.ItemText><b>Native Formats</b></Dropdown.ItemText>
                                <Dropdown.Item onClick={() => {setVideoType('mp4'); setVideoQuality(qualityOptions.mp4[0].quality); setItag(qualityOptions.mp4[0].itag)}}>.mp4</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setVideoType('webm'); setVideoQuality(qualityOptions.webm[0].quality); setItag(qualityOptions.webm[0].itag)}}>.webm</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.ItemText><b>Other Formats</b></Dropdown.ItemText>
                                <Dropdown.Item onClick={() => {setVideoType('mkv'); setVideoQuality(qualityOptions.webm[0].quality); setItag(qualityOptions.webm[0].itag)}}>.mkv</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setVideoType('mov'); setVideoQuality(qualityOptions.webm[0].quality); setItag(qualityOptions.webm[0].itag)}}>.mov</Dropdown.Item>
                            </DropdownButton>
                            {' '}
                        </Form.Group>
                    </Form>
                    <br/>
                    <h4>Quality Options</h4>
                    {/* For choosing Video Quality */}
                    <Stack gap={2}>
                        <Stack direction="horizontal" gap={3}>
                            <h5 style={{display: "inline"}}>Video: </h5>
                            <DropdownButton id="dropdown-basic-button" title={videoQuality} variant="info" style={{display: "inline"}}>
                                        {(qualityOptions.mp4 && qualityOptions.webm) ? (
                                            videoType==='webm' ? (qualityOptions.webm).map((element,i) => (
                                                <Dropdown.Item key={i} onClick={() => {setVideoQuality(element.quality); setItag(element.itag)}}>{element.quality} (Itag: {element.itag})</Dropdown.Item>
                                            )) : (qualityOptions.mp4).map((element,i) => (
                                                <Dropdown.Item key={i} onClick={() => {setVideoQuality(element.quality); setItag(element.itag)}}>{element.quality} (Itag: {element.itag})</Dropdown.Item>
                                            ))
                                        ) : ("Loading...")}
                            </DropdownButton>
                        </Stack>
                            <Stack direction="horizontal" gap={3}>
                                <h5 style={{display: "inline"}}>Audio: </h5>
                                <DropdownButton id="dropdown-basic-button" title={audioQuality} variant="info" style={{display: "inline"}}>
                                    <Dropdown.Item onClick={() => setAudioQuality('High')}>High</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setAudioQuality('Low')}>Low</Dropdown.Item>
                                </DropdownButton>
                            </Stack>
                    </Stack> 
                </Modal.Body>
                <Modal.Footer style={props.userSettings.Appearance.mode}>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="Submit" onClick={(e) => {
                    e.preventDefault();
                    if(nameRef.current.value === ""){
                        setNameError(false)
                        console.log("Error: File must have valid name")
                    }
                    else{
                        setNameError(true);
                        downloadVideo();
                        handleClose();
                    }
                
                }}>Download</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default VideoDownloader;