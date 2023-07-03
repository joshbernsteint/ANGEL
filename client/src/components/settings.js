import { Stack, Tabs, Tab, Container, Row, Col, Form, Button, Modal, FormCheck } from "react-bootstrap";
import { useState, useEffect } from 'react'
import "../App.css";

function Settings(props){

    const all_menus = ['General', 'Appearance', 'Downloader','Converter'];
    const text_sizes = ['Extra large','Large','Medium','Small']
    const lightMode = {background: "white", color: "black"};
    const darkMode = {background: "black", color: "white"};
    
    function SubHeader(props){
        return (
            <>
                <h3>{props.title}</h3>
                <hr style={{width: "15%"}}/>
            </>
        );
    }

    const [settingsJSON, setSettingsJSON] = useState(props.userSettings);

    function General(){
        return (
            <div>
                <SubHeader title="Source code"/>
                Check out the GitHub source code here: {' '}<Button variant="secondary" href="https://github.com/joshbernsteint/ANGEL" target="_blank" style={{marginLeft: "15px"}}>GitHub{' '}<img src="./gitHub.png" width="50px"></img></Button>
                
            </div>
        );
    }

    function Appearance(){
        return (
            <div>
                <SubHeader title="Display Mode"/>
                <Container fluid style={{width: "100%"}}>
                    <Row>
                        <Col xs={3}>
                            <h5>Dark Mode</h5>
                            <h5>Text Size</h5>
                        </Col>
                        <Col>
                            <Form>
                                <FormCheck type="switch" id="dark_mode_switch" onChange={(e) => {
                                    const isDark = !(settingsJSON.Appearance.is_dark_mode == true);
                                    if(isDark){
                                        setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, is_dark_mode: !(settingsJSON.Appearance.is_dark_mode == true), mode: darkMode}});
                                    }
                                    else{
                                        setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, is_dark_mode: !(settingsJSON.Appearance.is_dark_mode == true), mode: lightMode}});
                                    }
                                }}
                                checked={settingsJSON.Appearance.is_dark_mode == true}
                                />


                                {/* Text size selector, may be implemented later */}
                                <Form.Select style={{width: "25%"}} onChange={(e) => setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, text_size: e.target.value}})}>
                                    <option>{settingsJSON.Appearance.text_size}</option>
                                    {text_sizes.filter(el => {
                                        return el  !== settingsJSON.Appearance.text_size
                                    }).map((el,i) => (
                                        <option key={i}>{el}</option>
                                    ))}
                                </Form.Select>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    function DownloadOptions(){
        return (
            <div>
                <SubHeader title="Audio"/>
                <SubHeader title="Video"/>
            </div>
        );
    }

    function ConverterOptions(){
        return (
            <div>
                Lorem Ipsum
            </div>
        );
    }

    
    function displaySettings(){
        switch (settingsJSON.Appearance.settings_window) {
            case "General":
                return (<General/>)
            case "Appearance":
                return (<Appearance/>)
            case "Downloader":
                return (<DownloadOptions/>)
            case "Converter":
                return (<ConverterOptions/>)
            default:
                break;
        }
    }
                
                
    const [show, setShow] = useState(false);
    const [applyingDefault, setApplyingDefault] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <div style={{paddingTop: "5rem"}}>
            <Stack direction="horizontal" className="settings_window">
                <Stack className="settings_tab_menu">
                    <h2>Submenus</h2>
                    <hr/>
                    <Tabs
                        defaultActiveKey={settingsJSON.Appearance.settings_window}
                        id="justify-tab-example"
                        className="flex-column"
                        variant="pills"
                        transition={false}
                        onSelect={(e) => setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, settings_window: e}})}
                        >
                        {all_menus.map((el, i) => (
                            <Tab eventKey={el} key={i} title={<h4>{el}</h4>} className="tab_button" tabClassName="tab_link"/>
                            ))}
                        </Tabs>
                </Stack>
                <Stack className="settings_options">
                    <h1 className="center_title" style={{borderColor: (props.userSettings.Appearance.is_dark_mode ? "white" : "black")}}>{settingsJSON.Appearance.settings_window}</h1>
                    {displaySettings()}
                    <div className="apply_button">
                        <Stack direction="horizontal" gap={2}>
                            <Button variant="danger" className="settings_button" type="submit" onClick={e => {setApplyingDefault(true);handleShow();}}><b>Reset to Default</b></Button>
                            <Button variant="success" className="apply_button" type="submit" onClick={e => {setApplyingDefault(false);handleShow();}}><b>Apply</b></Button>






                            <Modal show={show} onHide={handleClose} backdrop="static" animation={false}>
                                <Modal.Header>
                                <Modal.Title>Are you sure?</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>If you overwrite the settings, there is no way to undo without manually changing everything back.</Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Actually, nevermind
                                </Button>
                                <Button variant="warning" onClick={e => {(applyingDefault ? props.setUserSettings(props.default) : props.setUserSettings(settingsJSON));handleClose();}}>
                                    Yes I'm sure
                                </Button>
                                </Modal.Footer>
                            </Modal>
                            
                            
                        </Stack>
                    </div>
                </Stack>
            </Stack>
        </div>
    );
}

export default Settings