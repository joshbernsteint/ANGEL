import { Stack, Tabs, Tab } from "react-bootstrap";
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import "../App.css";

function Settings(){

    const all_menus = ['General', 'Appearance'];
    const [curMenu, setCurMenu] = useState(all_menus[0]);
    const [color, setColor] = useState("#aabbcc");

    function displaySettings(){
        switch (curMenu) {
            case "General":
                return (<h1>General!</h1>)
            case "Appearance":
                return (<h1>Appearance!</h1>)
            case "Download Preferences":
                return (<h1>Preferences!</h1>)
            default:
                break;
        }
    }

    return (
        <div style={{paddingTop: "5rem"}}>
            <Stack direction="horizontal" className="settings_window">
                <Stack className="settings_tab_menu">
                    <h2>Setting Submenus</h2>
                    <hr/>
                    <Tabs
                        defaultActiveKey={all_menus[0]}
                        id="justify-tab-example"
                        className="flex-column"
                        variant="pills"
                        transition={false}
                        onSelect={(e) => setCurMenu(e)}
                        >
                        {all_menus.map((el, i) => (
                            <Tab eventKey={el} key={i} title={<h4>{el}</h4>} className="tab_button" tabClassName="tab_link"/>
                            ))}
                        </Tabs>
                </Stack>
                <Stack className="settings_options">
                    <h1 className="center">{curMenu}</h1>
                            <HexColorPicker color={color} onChange={(e) => {
                                setColor(e);
                                console.log(e);
                            }}/>
                    {displaySettings()}
                </Stack>
            </Stack>
        </div>
    );
}

export default Settings