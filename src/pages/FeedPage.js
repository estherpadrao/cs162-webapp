import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import Items from '../components/Items';

function FeedSidebar() {
  return (
    <Navbar sticky="top" className="flex-column align-items-start pt-0">
      <Nav className="flex-column w-100">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/feed" end>Feed</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/lists">My Lists</Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default function FeedPage() {
  return (
    <Container fluid className="py-3">
      <Row>
        <Col xs={12} md={3} lg={2}>
          <FeedSidebar />
        </Col>
        <Col xs={12} md={9} lg={10}>
          <h4 className="mb-3">Your Feed</h4>
          <Items content="feed" />
        </Col>
      </Row>
    </Container>
  );
}
