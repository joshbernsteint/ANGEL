import "../App.css"
import { Button, Form, Stack, Row } from "react-bootstrap";
import fileDownload from 'react-file-download'
import { Navigate } from 'react-router-dom'
import { useRef, useState } from "react";
import axios from 'axios'




function Audio_downloader(){
    const urlRef = useRef(null)
    const [id, setID] = useState(null)

    async function getID(e){
            e.preventDefault();
            let id_response = () => {
                return new Promise(function(resolve, reject){
                    axios.get(`http://localhost:5000/get_id`,{ params: {url: urlRef.current.value}}).then(
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
                setID(video_data.id)
                console.log(video_data)
            }
            urlRef.current.value=""
        window.open(`http://localhost:5000/audio/${video_data.id}/high`)

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
        </div>
    );
}

export default Audio_downloader;