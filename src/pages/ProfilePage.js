import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: 480 }} className="shadow-sm">
        <Card.Header className="fw-bold fs-5">My Profile</Card.Header>
        <Card.Body>
          <Stack gap={3}>
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 56, height: 56, fontSize: '1.4rem' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-semibold fs-5">{user.name}</div>
                <div className="text-muted">{user.email}</div>
              </div>
            </div>

            <hr className="my-1" />

            <Stack direction="horizontal" gap={2}>
              <span className="text-muted small">User ID:</span>
              <Badge bg="secondary">#{user.id}</Badge>
            </Stack>

            <div className="d-flex gap-2 mt-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/lists')}
              >
                My Lists
              </Button>
              <Button variant="outline-danger" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </Stack>
        </Card.Body>
      </Card>
    </div>
  );
}
