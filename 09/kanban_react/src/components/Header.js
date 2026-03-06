import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <Navbar bg="light" sticky="top" className="border-bottom">
      <Container>
        <Navbar.Brand>
          Kanban 
        </Navbar.Brand>

        <Nav className="ms-auto" variant="underline">
          <Nav.Link as={NavLink} to="/" end>
            Board
          </Nav.Link>
          <Nav.Link as={NavLink} to="/new">
            New Task
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
