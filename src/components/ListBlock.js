import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import ItemCard from './ItemCard';

const BASE = process.env.REACT_APP_BASE_API_URL || 'http://localhost:5000';

const COLUMNS = [
  { status: 'todo', label: 'To Do', variant: 'primary' },
  { status: 'doing', label: 'Doing', variant: 'warning' },
  { status: 'done', label: 'Done', variant: 'success' },
];

export default function ListBlock({ list, lists, isFirst, isLast, onChanged }) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(list.name);

  const handleRename = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const r = await fetch(`${BASE}/api/lists/${list.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (r.ok) {
      setRenaming(false);
      onChanged?.();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete list "${list.name}" and all its items?`)) return;
    const r = await fetch(`${BASE}/api/lists/${list.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (r.ok) onChanged?.();
  };

  const handleReorder = async (direction) => {
    const r = await fetch(`${BASE}/api/lists/${list.id}/reorder`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    if (r.ok) onChanged?.();
  };

  // Only top-level items (no parent) are in columns
  const topItems = list.items || [];

  return (
    <div className="list-block">
      {/* List header */}
      <Stack direction="horizontal" gap={2} className="mb-3 align-items-center">
        <Stack direction="horizontal" gap={1}>
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={isFirst}
            onClick={() => handleReorder('up')}
            title="Move list up"
          >
            ▲
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={isLast}
            onClick={() => handleReorder('down')}
            title="Move list down"
          >
            ▼
          </Button>
        </Stack>

        {renaming ? (
          <Form onSubmit={handleRename} className="flex-grow-1 d-flex gap-2">
            <Form.Control
              className="rename-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              required
            />
            <Button type="submit" size="sm" variant="primary">
              Save
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => { setRenaming(false); setNewName(list.name); }}
            >
              Cancel
            </Button>
          </Form>
        ) : (
          <>
            <h5 className="mb-0 fw-bold flex-grow-1">{list.name}</h5>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => setRenaming(true)}
              title="Rename list"
            >
              ✏
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={handleDelete}
              title="Delete list"
            >
              ✕
            </Button>
          </>
        )}
      </Stack>

      {/* Three columns */}
      <Row xs={1} md={3} className="g-3">
        {COLUMNS.map((col) => {
          const colItems = topItems.filter((i) => i.status === col.status);
          return (
            <Col key={col.status}>
              <Card className="h-100 border-0 bg-light">
                <Card.Header className="bg-transparent border-0 pb-0">
                  <span className="column-header">{col.label}</span>{' '}
                  <Badge bg={col.variant} pill>
                    {colItems.length}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Stack gap={2}>
                    {colItems.length === 0 ? (
                      <Alert variant="light" className="mb-0 text-muted small py-2">
                        No items
                      </Alert>
                    ) : (
                      colItems.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          lists={lists}
                          onChanged={onChanged}
                        />
                      ))
                    )}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
