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
                <Nav.Link as={Link} to="/login">
                  Sign In
                </Nav.Link>
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
                <Nav.Link
                  as={Link}
                  to={`users/${currentUser.artistname || "default"}/calendar`}
                >
                  {currentUser.name}'s Calendar
                </Nav.Link>
                <Nav.Link as={Link} to={`/users/${currentUser.userid}/profile`}>
                  {currentUser.artistname} Profile
                </Nav.Link>
                {currentUser.usertype ===
                  "Admin" && (
                    <>
                      <Nav.Link as={Link} to="users/list">
                        User List
                      </Nav.Link>
                    </>
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
