import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import TimeAgo from '../components/TimeAgo';
import Items from '../components/Items';
import { apiFetch, parseJsonSafe } from '../utils/api';

export default function UserPage() {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState();

  useEffect(() => {
    (async () => {
      const response = await apiFetch('/api/users/' + username);
      if (response.ok) {
        const body = await parseJsonSafe(response);
        setProfileUser(body);
      } else {
        setProfileUser(null);
      }
    })();
  }, [username]);

  return (
    <Container fluid className="py-3">
      <Row>
        <Col>
          {profileUser === undefined ?
            <Spinner animation="border" />
          :
            <>
              {profileUser === null ?
                <p>Could not retrieve user.</p>
              :
                <>
                  <Stack direction="horizontal" gap={4} className="mb-4">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center
                                 justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 80, height: 80, fontSize: '2rem' }}
                    >
                      {profileUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="mb-0">{profileUser.name}</h2>
                      <p className="text-muted mb-1">{profileUser.email}</p>
                      <p className="mb-0 small">
                        Member since: <TimeAgo isoDate={profileUser.created_at} />
                        <br />
                        Last seen: <TimeAgo isoDate={profileUser.last_active_at} />
                      </p>
                    </div>
                  </Stack>
                  <h5 className="mb-3">{profileUser.name}'s Items</h5>
                  <Items content={profileUser.username} />
                </>
              }
            </>
          }
        </Col>
      </Row>
    </Container>
  );
}
