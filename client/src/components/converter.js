import { useState } from 'react';
import '../App.css'
import { FileUploader } from 'react-drag-drop-files'



function uploadBox(){
    return (<h5 style={{border: ".5rem dotted blue", padding: "1rem", cursor: "pointer"}}>
        This is the upload box
    </h5>);
}


function Converter(props){
    const [files, setFiles] = useState([]);
    function handleChange(file){
        console.log('Selected files: ',[...files,file]);
        setFiles([...files,file])
    }


    return (
        <div className="home">
            <h1>File Converter</h1>
            <FileUploader handleChange={handleChange} multiple={true} hoverTitle={"Drag or drop multiple files of the same type"} children={uploadBox()}/>
        </div>
    );
}

export default Converter;