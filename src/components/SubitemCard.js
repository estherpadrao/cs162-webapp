import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import EditItemModal from './EditItemModal';

const BASE = process.env.REACT_APP_BASE_API_URL || 'http://127.0.0.1:5000';

export default function SubitemCard({ item, onChanged }) {
  const [showEdit, setShowEdit] = useState(false);

  const moveStatus = async (status) => {
    const r = await fetch(`${BASE}/api/items/${item.id}/status`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (r.ok) onChanged?.();
  };

  const deleteItem = async () => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    const r = await fetch(`${BASE}/api/items/${item.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (r.ok) onChanged?.();
  };

  return (
    <>
      <Card className="subitem-card border">
        <Card.Body className="py-2 px-3">
          <Stack direction="horizontal" gap={2} className="align-items-start">
            <div className="flex-grow-1">
              <div className="fw-semibold">{item.title}</div>
              {item.description && (
                <div className="text-muted small">{item.description}</div>
              )}
              {item.due_date && (
                <Badge bg="light" text="dark" className="mt-1 border">
                  📅 {item.due_date}
                </Badge>
              )}
            </div>
            <Stack direction="horizontal" gap={1} className="flex-shrink-0">
              {item.status !== 'doing' && (
                <Button
                  size="sm"
                  variant="outline-warning"
                  onClick={() => moveStatus('doing')}
                  title="Move to Doing"
                >
                  ▶
                </Button>
              )}
              {item.status !== 'todo' && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => moveStatus('todo')}
                  title="Move to To Do"
                >
                  ↩
                </Button>
              )}
              <Button
                size="sm"
                variant="outline-success"
                onClick={() => moveStatus('done')}
                title="Mark as Done"
              >
                ✓
              </Button>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setShowEdit(true)}
                title="Edit"
              >
                ✏
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={deleteItem}
                title="Delete"
              >
                ✕
              </Button>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>

      <EditItemModal
        item={item}
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onChanged={onChanged}
      />
    </>
  );
}
