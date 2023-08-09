import { useState, useMemo } from 'react';
import '../App.css'
import { FileUploader } from 'react-drag-drop-files'
import { getFileExtension, getFileSize } from '../tools/utils';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';



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

    function isDuplicateFile(file, index, file_list){
        var retVal = false;
        file_list.every((el,i) => {
            if(i !== index){
                if(el.name === file.name && el.size === file.size && el.lastModified === file.lastModified){
                    retVal = true;
                    return false;
                }
            }
            return true;
        })
        return retVal;
    }


    function removeFile(index){
        const list = props.files
        var result = []
        list.forEach((element,i) => {
            if(i !== index){
                result.push(element)
            }
        });
        props.setFiles(result)
    }

    function ListCell(props){
        const warning_overlay = (
            <Popover style={{width: "auto"}}>
                <Popover.Header as="h2"><b>Duplicate file detected</b></Popover.Header>
                <Popover.Body>
                    A duplicate of this file was also selected. If this was a mistake, you can remove either file. 
                </Popover.Body>
            </Popover>
        )


        return (
            <div className='list_cell'>
            <table style={{width: "100%"}}>
                <tbody>
                <tr>
                {/* Stats about the file */}
                <td>
                    <b style={{fontSize: "large", marginRight: "10px"}}>Filename: </b>{props.name}<br/>
                    <b style={{fontSize: "large", marginRight: "10px"}}>Size: </b> {getFileSize(props.size)}
                </td>
                {/* Warning display if this file is a duplicate */}
                <td style={{display: "flex", justifyContent: "right", marginLeft: "auto", marginRight: "60px"}} hidden={!props.isDupe}> 
                    <OverlayTrigger trigger={["hover","focus"]} overlay={warning_overlay} placement='bottom'>
                    <img src="./warning_file.png" height="50px" className='cell_warning'/>
                    </OverlayTrigger>
                </td>
                {/* Remove file button */}
                <td style={{display: "flex", justifyContent: "right", marginLeft: "auto", marginRight: "0px"}}>
                    <Button as='img' src="./remove_file.png" height="50px" className='cell_image' variant='outline-danger' onClick={() => removeFile(props.index)}>
                    </Button>
                </td>
                </tr>
                </tbody>
            </table>
            </div>
        )
    }


    return (
        <div className='file_list'>
            {props.files.map((el,i) => (
                <ListCell name={el.name} size={el.size} key={i} index={i} isDupe={isDuplicateFile(el,i,props.files)}/>
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
        <FileList files={files} setFiles={setFiles} style={props.styleSettings}/>
        </>
    );
}

export default Converter;