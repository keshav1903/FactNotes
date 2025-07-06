import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar on login/register pages
  }

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/notes" className="fw-bold">
          <i className="bi bi-pencil-square text-primary me-2"></i>
          FactCheck Notepad
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/notes" 
              active={location.pathname === '/notes'}
            >
              <i className="bi bi-journal-text me-1"></i>
              My Notes
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/history" 
              active={location.pathname === '/history'}
            >
              <i className="bi bi-clock-history me-1"></i>
              Fact-Check History
            </Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown 
              title={<><i className="bi bi-person-circle me-1"></i>{user?.username}</>} 
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                <i className="bi bi-person me-2"></i>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">
                <i className="bi bi-gear me-2"></i>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
