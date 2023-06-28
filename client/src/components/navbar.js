import {Nav,Container, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from "./navbar.module.css"

function MyNavbar(){

    return (
        <Navbar className={styles.nav} fixed="top" expand='lg'>
            <Container fluid>
                <Navbar.Brand to="/" className={styles.nav_brand}>
                    <img
                    alt="brand icon"
                    src="./icon.ico"
                    width="35"
                    height="35"
                    className="d-inline-block align-top"
                    />{' '}
                    __PLACEHOLDER__
                </Navbar.Brand>
                <Navbar.Toggle aria-controls = "basic-navbar-nav"/>
                <Navbar.Collapse id = "basic-navbar-nav" style = {{alignItems: "right",justifyContent:"right"}}>
                    <Nav className={`my-1 my-lg-2`} navbarScroll>
                        <Link to="/" className={styles.nav_item}>Home</Link>
                        <Link to="/audio_downloader" className={styles.nav_item}>Audio Downloader</Link>
                        <Link to="/video_downloader" className={styles.nav_item}>Video Downloader</Link>
                        <Link to="/converter" className={styles.nav_item}>Converter</Link>
                        <Link to="https://github.com/joshbernsteint/YouTube_Downloader" target="_blank" className={styles.nav_item}>GitHub Source</Link>
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