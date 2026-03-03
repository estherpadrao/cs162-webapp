import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Stack gap={4} className="py-3">
      <div className="text-center">
        <h1 className="display-5 fw-bold">Hierarchical Todo Lists</h1>
        <p className="lead text-muted">
          Organise your work into lists, items, and sub-items. Track progress
          across three stages: To Do, Doing, and Done.
        </p>
        {!user && (
          <Stack direction="horizontal" gap={2} className="justify-content-center">
            <Button as={Link} to="/register" variant="primary" size="lg">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary" size="lg">
              Log In
            </Button>
          </Stack>
        )}
        {user && (
          <Button as={Link} to="/lists" variant="primary" size="lg">
            Go to My Lists
          </Button>
        )}
      </div>

      <Row xs={1} md={3} className="g-4 mt-2">
        <Col>
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body className="py-4">
              <div className="display-6 mb-3">📋</div>
              <Card.Title>Multiple Lists</Card.Title>
              <Card.Text className="text-muted">
                Create as many lists as you need, name them anything, and
                reorder them to reflect your priorities.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body className="py-4">
              <div className="display-6 mb-3">🔀</div>
              <Card.Title>Three-Column Workflow</Card.Title>
              <Card.Text className="text-muted">
                Move tasks between To Do, Doing, and Done columns. Completed
                tasks disappear cleanly while staying in the database.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body className="py-4">
              <div className="display-6 mb-3">🗂️</div>
              <Card.Title>Sub-Items</Card.Title>
              <Card.Text className="text-muted">
                Break big tasks into smaller steps. Sub-items live inside their
                parent card and can be collapsed to keep the view tidy.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Stack>
  );
}
