import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Stack from 'react-bootstrap/Stack';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await login({ email, password });
      navigate('/lists');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow-sm">
        <Card.Header className="fw-bold fs-5">Log In</Card.Header>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Stack gap={3}>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Logging in…' : 'Log In'}
              </Button>

              <div className="text-center text-muted small">
                Don't have an account?{' '}
                <Link to="/register">Register</Link>
              </div>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
