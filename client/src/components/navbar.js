import {Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
// import '../App.css'
import styles from "./navbar.module.css"

function Nav_bar(){

    return (
        <Navbar className={styles.nav} fixed="top" expand='lg'>
            <Container fluid>
                <Navbar.Brand href="/" className={styles.nav_brand}>
                    <img
                    alt=""
                    src="/icon.ico"
                    width="35"
                    height="35"
                    className="d-inline-block align-top"
                    />{' '}
                    __PLACEHOLDER__
                </Navbar.Brand>
                <Navbar.Toggle aria-controls = "basic-navbar-nav"/>
                <Navbar.Collapse id = "basic-navbar-nav" style = {{alignItems: "right",justifyContent:"right"}}>
                    <Nav className={`my-1 my-lg-2`} navbarScroll>
                        <Nav.Link href="/" className={styles.nav_item}>Home</Nav.Link>
                        <Nav.Link href="/audio_downloader" className={styles.nav_item}>Audio Downloader</Nav.Link>
                        <Nav.Link href="/video_downloader" className={styles.nav_item}>Video Downloader</Nav.Link>
                        <Nav.Link href="/converter" className={styles.nav_item}>Converter</Nav.Link>
                        <Nav.Link href="https://github.com/joshbernsteint/YouTube_Downloader" target="_blank" className={styles.nav_item}>GitHub Source</Nav.Link>
                        <Nav.Link href="/settings" className={styles.nav_item}>
                            <img src="/settings.png"
                            width="30"
                            height="30"/>
                            </Nav.Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default Nav_bar;