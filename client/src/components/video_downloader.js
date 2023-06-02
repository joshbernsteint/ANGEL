import "../App.css"
import { Button, Form, Stack, Modal, Accordion, Dropdown, DropdownButton, OverlayTrigger, Popover } from "react-bootstrap";
import fileDownload from 'react-file-download'
import { Navigate } from 'react-router-dom'
import { useRef, useState, useEffect } from "react";
import axios from 'axios'





function Video_downloader(){
    const urlRef = useRef(null);
    const nameRef = useRef(null);

    const [videoData, setVideoData] = useState({});
    const [show, setShow] = useState(false)
    const [videoTime, setVideoTime] = useState('');
    const [videoType, setVideoType] = useState('.mp4');
    const [qualityOptions, setQualityOptions] = useState([]);
    const [videoQuality, setVideoQuality] = useState('Loading...')
    const [nameError, setNameError] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    function ShowQuality(props){
        const qualities = props.options
        if(videoQuality === 'Loading...'){
            setVideoQuality(qualities[0].quality)
            return (
                `${qualities[0].quality}`
            );
        }
        else{
            return (
                `${videoQuality}`
            );
        }
        
    }

    async function getVideoData(e){
        e.preventDefault()
        let data_response = () => {
            return new Promise(function(resolve, reject){
                axios.get(`http://localhost:5000/get_data`,{ params: {url: urlRef.current.value}}).then(
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
            console.log(video_data)

            //Converting video length into a more readable format
            let seconds = video_data.length_seconds
            const hours = Math.floor(seconds / 3600)
            seconds %= 3600;
            const minutes = Math.floor(seconds / 60);
            seconds %= 60;
            setVideoTime(`${hours}:${minutes}:${seconds}`)
            let options = [];
            video_data.video_options.forEach((element) => {
                const v_quality = element.quality;
                const itag = element.itag
                const type = element.video_type;
                if(type === 'webm'){
                    options.push({quality: v_quality, itag: itag})
                }
            })

            setQualityOptions(options);
            handleShow()
            
            // window.open(`http://localhost:5000/video/${responseData.data.id}/high`)
        }
    }

    return (
        <div className="home">
            <h2>YTOOO</h2>
            <h3>-----</h3>
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
                    <h5 style={{display: "inline"}}>Title: </h5><p style={{display: "inline"}}>{videoData.title}</p><br/>
                    <h5 style={{display: "inline"}}>Length: </h5><p style={{display: "inline"}}>{videoTime}</p><br/>
                    <h5 style={{display: "inline"}}>Video ID: </h5><p style={{display: "inline"}}>{videoData.id}</p><br/>
                    {(!videoData.desc) ? (<h5 style={{color: "red"}}>No Description</h5>) : (
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><h6>Description</h6></Accordion.Header>
                                <Accordion.Body>{videoData.desc}</Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}
                    <br/>
                        <Form>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Enter name for file" ref={nameRef} style={{width: "50%",display: "inline"}} required/>
                            <DropdownButton id="dropdown-basic-button" title={videoType} style={{width: "10%",display: "inline"}}  variant="success">
                                <Dropdown.ItemText><b>Native Formats</b></Dropdown.ItemText>
                                <Dropdown.Item onClick={() => setVideoType('.mp4')}>.mp4</Dropdown.Item>
                                <Dropdown.Item onClick={() => setVideoType('.webm')}>.webm</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.ItemText><b>Other Formats</b></Dropdown.ItemText>
                                <Dropdown.Item onClick={() => setVideoType('.mkv')}>.mkv</Dropdown.Item>
                                <Dropdown.Item onClick={() => setVideoType('.mov')}>.mov</Dropdown.Item>
                            </DropdownButton>
                            {' '}
                            {/* For choosing Video Quality */}
                            <DropdownButton id="dropdown-basic-button" title={<ShowQuality options = {qualityOptions}/>} style={{width: "40",display: "inline"}}  variant="info">
                                {qualityOptions.map((element, i) => (
                                    <Dropdown.Item key = {i} onClick={() => setVideoQuality(element.quality)}>{element.quality}</Dropdown.Item>
                                ))}

                                
                            </DropdownButton>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="Submit" onClick={(e) => {e.preventDefault();console.log('submitted!')}}>Download</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Video_downloader;