import { Stack, Tabs, Tab, Container, Row, Col, Form, Button, Modal, FormCheck } from "react-bootstrap";
import { useState, useEffect, useRef } from 'react'
import "../App.css";

function Settings(props){

    const all_menus = ['General', 'Appearance', 'Downloader','Converter'];
    const text_sizes = ['X-large','Large','Medium','Small'];
    const pages = ['Home','Audio Downloader', 'Video Downloader','Converter','Settings', 'None'];
    
    function SubHeader(props){
        return (
            <>
                <h3>{props.title}</h3>
                <hr style={{width: "15%"}}/>
            </>
        );
    }

    const [settingsJSON, setSettingsJSON] = useState(props.userSettings);
    const [usingPort, setUsingPort] = useState(props.userSettings.General.custom_port);
    const [customPort, setCustomPort] = useState(props.userSettings.General.port);

    function General(){
        return (
            <div>
                <SubHeader title="Defaults"/>
               
                
                <Container fluid style={{width: "100%"}}>
                    <Row>
                        <Col xs={3}>
                            <h5 className="top_bottom">Default Page on Start-up</h5>
                            <h5 className="top_bottom">Language</h5>
                            <h5 className="top_bottom">Colorblind mode</h5>
                        </Col>
                        <Col>

                            <Form className="top_bottom">
                                <Form.Select style={{width: "20%"}} onChange={(e) => setSettingsJSON({...settingsJSON,General: {...settingsJSON.General, default_page: e.target.value}})}>
                                    <option>{settingsJSON.General.default_page}</option>
                                    {pages.filter(el => {
                                        return el  !== settingsJSON.General.default_page
                                    }).map((el,i) => (
                                        <option key={i}>{el}</option>
                                    ))}
                                </Form.Select>
                            </Form>

                            <p><b className="top_bottom">Coming Soon!</b></p>
                            <p><b className="top_bottom">Coming Soon!</b></p>
                        </Col>
                    </Row>
                </Container>
                
                <SubHeader title="Advanced"/>
                <Container fluid style={{width: "100%"}}>
                    <Row>
                        <Col xs={3}>
                            <h5 className="top_bottom">Enable custom server port</h5>
                            <br className="top_bottom"/>                     
                        </Col>
                        <Col>
                            <Form className="top_bottom" style={{width: "15%"}} onSubmit={e => e.preventDefault()}>
                                <Form.Check type="checkbox" label="" id="custom_port_switch" onChange={e => {
                                    setUsingPort(e.target.checked)
                                    if(!e.target.checked){
                                        setCustomPort(props.userSettings.General.port)
                                    }
                                }} checked={usingPort}/>
                                <Form.Control type="number" disabled={!usingPort} autoFocus value={customPort} onChange={e => {
                                    setCustomPort(e.target.value)
                                }}
                                isInvalid={customPort < 0 || customPort > 65535}
                                isValid={0 <= customPort && customPort <= 65535}
                                />
                            </Form>
                        </Col>
                    </Row>
                </Container>

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
                                        setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, is_dark_mode: !(settingsJSON.Appearance.is_dark_mode == true)}});
                                    }
                                    else{
                                        setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, is_dark_mode: !(settingsJSON.Appearance.is_dark_mode == true)}});
                                    }
                                }}
                                checked={settingsJSON.Appearance.is_dark_mode == true}
                                />


                                {/* Text size selector, may be implemented later */}
                                <Form.Select style={{width: "15%"}} onChange={(e) => setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, text_size: e.target.value}})}>
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

    function handleSubmit(){
        console.log('hgereer');
        (applyingDefault ? props.setUserSettings(props.default) : props.setUserSettings({...settingsJSON,General: {...settingsJSON.General,custom_port: usingPort},Appearance: {...settingsJSON.Appearance, settings_window: "General"}}));
        handleClose();
    }

    return (
        <div style={{paddingTop: "5rem"}}>
            <Stack direction="horizontal" className="settings_window">
                <Stack className="settings_tab_menu">
                    <h2>Submenus</h2>
                    <hr style={{width: "60%"}}/>
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
                                <Button variant="warning" onClick={handleSubmit}>
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