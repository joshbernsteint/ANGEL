import { useState, useMemo } from 'react';
import '../App.css'
import { FileUploader } from 'react-drag-drop-files'
import { getFileExtension, getFileSize } from '../tools/utils';
import { Button, Table } from 'react-bootstrap';



function uploadBox(isDarkMode){
    return (
    <div className='upload_box'>
        <img 
        src= {isDarkMode ? "./upload_light.png" : "./upload_dark.png"}
        height="150px"
        />
        <h3 style={{paddingTop: "1rem"}}>Drag and drop files into this box</h3>
        <p style={{fontSize: "medium"}}>Or click to select from your computer</p>
    </div>
    );
}

function FileList(props){
    function ListCell(props){
        return (
            <div className='list_cell'>
            <table style={{width: "100%"}}>
                <td>
                    <b style={{fontSize: "large", marginRight: "10px"}}>Filename: </b>{props.name}<br/>
                    <b style={{fontSize: "large", marginRight: "10px"}}>Size: </b> {getFileSize(props.size)}
                </td>
                <td style={{display: "flex", justifyContent: "right", marginLeft: "auto", marginRight: "0px"}}>
                    <Button as='img' src="./remove_file.png" height="50px" className='cell_image' variant='outline-danger'>
                    </Button>
                </td>
            </table>
            </div>
        )
    }


    return (
        <div className='file_list'>
            {props.files.map((el,i) => (
                <ListCell name={el.name} size={el.size} key={i}/>
            ))}
        </div>
    );
}


function Converter(props){
    const settings = props.userSettings;
    const [files, setFiles] = useState([]);
    const accepted_types = ["MP4"]

    function handleChange(file){
        var file_list = [];
        for (let index = 0; index < file.length; index++) {
            const element = file.item(index);
            file_list.push(element)
        }
        setFiles([...files,...file_list])
        console.log('Selected files: ',[...files,...file_list]);
    }


    return (
        <>
        <div className="home">
            <h1>File Converter</h1>
            <FileUploader handleChange={handleChange} multiple={true} hoverTitle={"Drag or drop multiple files of the same type"} children={uploadBox(settings.Appearance.is_dark_mode)} types={accepted_types}/>
        </div>
        <FileList files={files}/>
        </>
    );
}

export default Converter;