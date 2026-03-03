import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar bg="white" sticky="top" className="border-bottom shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-primary">
          📝 Todo App
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center" variant="underline">
          <Nav.Link as={NavLink} to="/" end>
            Home
          </Nav.Link>

          {user ? (
            <>
              <Nav.Link as={NavLink} to="/lists">
                My Lists
              </Nav.Link>
              <Nav.Link as={NavLink} to="/profile">
                {user.name}
              </Nav.Link>
              <Button
                variant="outline-secondary"
                size="sm"
                className="ms-2"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/login">
                Log In
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
