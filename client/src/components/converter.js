import { useState, useMemo } from 'react';
import '../App.css'
import { FileUploader } from 'react-drag-drop-files'
import { getFileExtension, getFileSize, getUniqueFileTypes, isDuplicateFile, removeDuplicates } from '../tools/utils';
import { Button, Dropdown, DropdownButton, OverlayTrigger, Popover, Stack } from 'react-bootstrap';
import axios from 'axios'

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
    const [convertType, setType] = useState('mp3')
    const audioTypes = ["mp3", "wav", "ogg"];
    const videoTypes = ["mp4", "mov", "mkv"];

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
        const num_warnings = props.isDupe + props.isSameExtension;
        const [isDownloading, setIsDownloading] = useState(false);
        
        const warning_overlay = (
            <Popover style={{width: "auto"}}>
                <Popover.Header as="h2"><b>{num_warnings} Warning(s)</b></Popover.Header>
                <Popover.Body>
                    {props.isDupe ? 
                    (<b style={{fontSize: "medium"}}>Warning: Duplicate file selected. It will be deleted</b>) : (<></>)}
                    {props.isSameExtension && props.isDupe ? (<hr/>) : (<></>)}
                    {props.isSameExtension ? 
                    (<b style={{fontSize: "medium"}}>Warning: Conversion type selected is the same as file type</b>) : (<></>)}
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
                <td style={{display: "flex", justifyContent: "right", marginLeft: "auto", marginRight: "60px"}} hidden={!num_warnings}> 
                    <OverlayTrigger trigger={["hover","focus"]} overlay={warning_overlay} placement='auto'>
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

    /**
     * Handles the communication with the server over the conversion of files from one format to another
     */
    async function handleConvert(){
        const port = props.settings.General.port;
        const BYTE_CHUNK = 1000000;
        const file_list = removeDuplicates(props.files);
        const num_files = file_list.length;
        console.log("Beginning File Upload...");


        /**
         * Calls the backend API to convert cached files if all of the files have been successfully uploaded.
         * 
         * Action will only be performed if the index matches the final index of the `File` object list
         * @param {int} file_num: The index of the current file in the list
         * @returns Nothing
         */
        async function convertFiles(file_num){
            if(file_num !== num_files){
                return;
            }
            else{
                console.log("All files uploaded!");
                props.setFiles([]);
                console.log("Converting...");
                await fetch(`http://localhost:${port}/convert_files/${convertType}`)
                //TODO: Change API call so it doesn't suck

            }
        }
        async function sendManifest(){
            var manifest = [];
            file_list.forEach(el => {
                manifest.push({name: el.name, size: el.size})
            })
            let manifest_send = () => {
                return new Promise(function(resolve, reject){
                    axios.get(`http://localhost:${port}/upload_manifest`,{ params: {files: manifest}}).then(
                        response => resolve(response)
                    );
                });
            }
            await manifest_send();
        }

        await sendManifest();
        var num_201 = 0;
        file_list.forEach((cur_file,i) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(cur_file);
            reader.onload = async (event) => {
                const full_file = event.target.result;
                const num_chunks = Math.ceil(full_file.byteLength / BYTE_CHUNK);
                for (let chunk_index = 0; chunk_index < num_chunks; chunk_index++) {
                    const temp_bytes = full_file.slice(chunk_index*BYTE_CHUNK, (chunk_index+1)*BYTE_CHUNK);
                    await fetch(`http://localhost:${port}/upload_files/${cur_file.name}`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/octet-stream",
                            'Content-Length': temp_bytes.length,
                        },
                        body: temp_bytes
                    }).then(res => res.status).then(status =>{
                        if(status === 201){
                            num_201++;
                            convertFiles(num_201)
                        }
                    })
                }
            }
        });
    }

    return (
            <Stack direction='horizontal'>
                <Stack className='file_list'>

                {props.files.map((el,i) => (
                    <ListCell name={el.name} size={el.size} key={i} index={i} isDupe={isDuplicateFile(el,i,props.files)} isSameExtension={getFileExtension(el.name) === convertType.toUpperCase()}/>
                    ))}
                </Stack>
                <Stack className='file_list' style={{left: "59%", border: ".5rem solid blue", width: "40rem", height: "21rem", borderRadius: "10px", top: "56%", overflow: "hidden", zIndex: "1"}}>
                    <h2 className='conversion_header'>Conversion Stats & Settings</h2>
                    <h3 className='conversion_stats'>Convert to: </h3>
                    <DropdownButton title={convertType} variant="primary" style={{width: "20%", display: "inline", top: "-1%"}} size='lg'>
                        <div style={{maxHeight: "10rem",overflow: "scroll"}}>
                        <Dropdown.Header><h5><b>Audio Formats</b></h5></Dropdown.Header>
                            {audioTypes.map((el,i) => (
                                <Dropdown.Item as="button" key={i} onClick={() => setType(el)}>{el}</Dropdown.Item>   
                                ))}
                        <Dropdown.Divider/>
                        <Dropdown.Header><h5><b>Video Formats</b></h5></Dropdown.Header>
                            {videoTypes.map((el,i) => (
                                <Dropdown.Item as="button" key={i} onClick={() => setType(el)}>{el}</Dropdown.Item>   
                                ))}
                        </div>
                    </DropdownButton><br/><br/>
                    <h3 className='conversion_stats'>Total number of files: {props.files.length}</h3><br/>
                    <h3 className='conversion_stats'>Total number of bytes: {getFileSize(props.files.reduce((prev, curFile, i) => {
                            prev += curFile.size;
                            return prev;
                        },0))}</h3><br/>
                    <h3 className='conversion_stats'>Input file type(s): {getUniqueFileTypes(props.files)}</h3><br/>
                    <Stack direction='horizontal' gap={2} style={{padding: "1rem", float: "right"}}>
                        <Button variant='danger' size='lg' onClick={() => props.setFiles([])}>Remove All Files</Button>
                        <Button variant='success' size='lg' onClick={handleConvert}>Convert</Button>
                    </Stack>    
                </Stack>
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
    }


    return (
        <>
        <div className="home" style={{position: "fixed", left: "6%"}}>
            <h1>File Converter</h1>
            <FileUploader handleChange={handleChange} multiple={true} hoverTitle={"Drag or drop multiple files of the same type"} children={uploadBox(settings.Appearance.is_dark_mode)} types={accepted_types}/>
        </div>
        <FileList files={files} setFiles={setFiles} style={props.styleSettings} settings={settings}/>
        </>
    );
}

export default Converter;