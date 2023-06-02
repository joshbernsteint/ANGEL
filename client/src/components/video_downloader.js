import "../App.css"
import { Button, Form, Stack, Row } from "react-bootstrap";
import fileDownload from 'react-file-download'
import { Navigate } from 'react-router-dom'
import { useRef, useState } from "react";
import axios from 'axios'


function Video_downloader(){
    const urlRef = useRef(null)

    const [videoData, setVideoData] = useState({});


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
            //TODO: show video download options
        }
        urlRef.current.value=""
        window.open(`http://localhost:5000/video/${responseData.data.id}/high`)
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
        </div>
    );
}

export default Video_downloader;