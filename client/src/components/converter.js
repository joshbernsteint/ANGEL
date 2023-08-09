import { useState, useMemo } from 'react';
import '../App.css'
import { FileUploader } from 'react-drag-drop-files'
import { getFileExtension, getFileSize, isDuplicateFile } from '../tools/utils';
import { Button, OverlayTrigger, Popover, Stack } from 'react-bootstrap';


//Creates a box for uploading files that looks nice
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

/**
 * Creates a FileList component, meant to display the data of File objects in `files`
 * @param {*} props 
 * @returns: The makeup of a FileList component
 */
function FileList(props){

    /**
     * Removes the File object at the specified index from `props.files`. This will cause a page reload!
     * @param {int} index: The index of the File object to be removed 
     */
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

    /**
     * A component for each cell in `FileList`
     * @param {*} props 
     * @returns A `ListCell` Component
     */
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
        <Stack className='file_list'>
            {props.files.map((el,i) => (
                <ListCell name={el.name} size={el.size} key={i} index={i} isDupe={isDuplicateFile(el,i,props.files)}/>
            ))}
        </Stack>
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
        // console.log('Selected files: ',[...files,...file_list]);
    }


    return (
        <>
        <div className="home" style={{position: "fixed", left: "6%"}}>
            <h1>File Converter</h1>
            <FileUploader handleChange={handleChange} multiple={true} hoverTitle={"Drag or drop multiple files of the same type"} children={uploadBox(settings.Appearance.is_dark_mode)} types={accepted_types}/>
        </div>
        <FileList files={files} setFiles={setFiles} style={props.styleSettings}/>
        </>
    );
}

export default Converter;