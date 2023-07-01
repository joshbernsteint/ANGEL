import { Stack, Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from 'react'
import "../App.css";

function Settings(props){

    const all_menus = ['General', 'Appearance'];
    const text_sizes = ['Extra large','Large','Medium','Small']
    const lightMode = {background: "white", color: "black"};
    const darkMode = {background: "black", color: "white"};

    const [settingsJSON, setSettingsJSON] = useState(props.userSettings);

    function General(){
        return (
            <h1>General!</h1>
        );
    }

    function Appearance(){
        return (
            <div>
                <h3>Display Mode</h3>
                <hr style={{width: "15%"}}/>
                <Container fluid style={{width: "100%"}}>
                    <Row>
                        <Col xs={3}>
                            <h5>Dark Mode</h5>
                            <h5>Text Size</h5>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Check type="switch" id="dark_mode" onChange={(e) => {
                                    e.preventDefault()
                                    if(e.target.checked){
                                        setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, mode: darkMode, is_dark_mode: true}});
                                    }
                                    else{
                                        setSettingsJSON({...settingsJSON, Appearance: {...settingsJSON.Appearance, mode: lightMode, is_dark_mode: false}});

                                    }
                                }}
                                defaultChecked={settingsJSON.Appearance.is_dark_mode}
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



    function displaySettings(){
        switch (settingsJSON.Appearance.settings_window) {
            case "General":
                return (<General/>)
            case "Appearance":
                return (<Appearance/>)
            default:
                break;
        }
    }





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
                        <Button variant="success" className="apply_button" type="submit" onClick={e => props.setUserSettings(settingsJSON)}><b>Apply</b></Button>
                    </div>
                </Stack>
            </Stack>
        </div>
    );
}

export default Settings