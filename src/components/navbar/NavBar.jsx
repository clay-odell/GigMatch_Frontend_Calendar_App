import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const NavBar = () => {
  const { currentUser } = useUser();

  return (
    <Navbar bg="primary" data-bs-theme="dark" fixed="top" expand="md">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          GigMatch
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {!currentUser ? (
              <>
                <NavDropdown title="Log In">
                  <NavDropdown.Item as={Link} to="/artist-login">
                    Artist Login
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/venue-login">
                    Venue Login
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/artist-register">
                  Artist Sign Up
                </Nav.Link>
                <Nav.Link as={Link} to="/venue-register">
                  Venue Sign Up
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/master-calendar">
                  Main Calendar
                </Nav.Link>
                <Nav.Link as={Link} to={`users/${currentUser.usertype === "Artist" ? currentUser.artistname : currentUser.venuename}/calendar`}>
                  {currentUser.usertype === "Artist" ? currentUser.artistname : currentUser.venuename}'s Calendar
                </Nav.Link>
                <Nav.Link as={Link} to={`/users/${currentUser.userid}/profile`}>
                  {currentUser.name}'s Profile
                </Nav.Link>
                {currentUser.usertype === "Admin" && (
                  <Nav.Link as={Link} to="users/list">
                    Users List
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
