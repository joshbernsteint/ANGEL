import {Nav,Container, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import styles from "./navbar.module.css"
import { useEffect, useState } from 'react';

function MyNavbar(props){
    const navigate = useNavigate();
    const [navigator, setNavigator] = useState(0);
    
    useEffect(() =>{
        if(navigator > 0 && navigator < 2){
            console.log('Navigating to default page...');
            switch (props.settings.General.default_page) {
                case 'Home':
                    navigate('/')
                    break;
                case 'Audio Downloader':
                    navigate('/audio_downloader')
                    break;
                case 'Video Downloader':
                    navigate('/video_downloader')
                    break;
                case 'Converter':
                    navigate('/converter')
                    break;
                case 'Settings':
                    navigate('/settings')
                    break;
                case 'None':
                    console.log('nevermind!');
                    break;
                default:
                    break;
            }
        }
        setNavigator(navigator+1);
        // console.log('navigating...');
    },[props.settings.General]);

    return (
        <Navbar className={styles.nav} fixed="top" expand='lg'>
            <Container fluid>
                <Navbar.Brand to="/" className={styles.nav_brand} href="#">
                    <img
                    alt="brand icon"
                    src="./angel.png"
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    />{' '}
                    ANGEL
                </Navbar.Brand>
                <Navbar.Toggle aria-controls = "basic-navbar-nav"/>
                <Navbar.Collapse id = "basic-navbar-nav" style = {{alignItems: "right",justifyContent:"right"}}>
                    <Nav className={`my-1 my-lg-2`} navbarScroll>
                        <Link to="/" className={styles.nav_item}>Home</Link>
                        <Link to="/audio_downloader" className={styles.nav_item}>Audio Downloader</Link>
                        <Link to="/video_downloader" className={styles.nav_item}>Video Downloader</Link>
                        <Link to="/converter" className={styles.nav_item}>Converter</Link>
                        <Link to="/settings" className={styles.nav_item}>
                            <img src="./settings.png"
                            width="30"
                            alt="settings icon"
                            height="30"/>
                            </Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default MyNavbar;