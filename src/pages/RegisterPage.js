import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Stack from 'react-bootstrap/Stack';
import { useUser } from '../contexts/UserProvider';

export default function RegisterPage() {
  const { register } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await register(email, name, password);
      navigate('/lists');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow-sm">
        <Card.Header className="fw-bold fs-5">Create an Account</Card.Header>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Stack gap={3}>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group controlId="name">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Form.Text className="text-muted">At least 6 characters.</Form.Text>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Creating account…' : 'Register'}
              </Button>

              <div className="text-center text-muted small">
                Already have an account?{' '}
                <Link to="/login">Log In</Link>
              </div>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
