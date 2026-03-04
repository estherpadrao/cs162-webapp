import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import SubitemCard from './SubitemCard';
import EditItemModal from './EditItemModal';

const BASE = process.env.REACT_APP_BASE_API_URL || 'http://localhost:5000';

// status → column label mapping
const STATUS_LABELS = { todo: 'To Do', doing: 'Doing', done: 'Done' };
const ALL_STATUSES = ['todo', 'doing', 'done'];

export default function ItemCard({ item, lists, onChanged }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [movingList, setMovingList] = useState(false);

  const visibleSubitems = (item.subitems || []).filter((s) => s.status !== 'done');
  const otherStatuses = ALL_STATUSES.filter((s) => s !== item.status);

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

  const handleMoveList = async (e) => {
    const newListId = parseInt(e.target.value, 10);
    if (!newListId || newListId === item.list_id) return;
    setMovingList(true);
    try {
      const r = await fetch(`${BASE}/api/items/${item.id}/movelist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_id: newListId }),
      });
      if (r.ok) onChanged?.();
    } finally {
      setMovingList(false);
    }
  };

  const otherLists = lists.filter((l) => l.id !== item.list_id);

  return (
    <>
      <Card className={`item-card shadow-sm ${item.status}`}>
        <Card.Body className="py-2 px-3">
          {/* Title row */}
          <Stack direction="horizontal" gap={2} className="align-items-start mb-1">
            <div className="flex-grow-1">
              <div className="fw-semibold">{item.title}</div>
              {item.description && (
                <div className="text-muted small mt-1">{item.description}</div>
              )}
              {item.due_date && (
                <Badge bg="light" text="dark" className="mt-1 border small">
                  📅 {item.due_date}
                </Badge>
              )}
            </div>
            <Stack direction="horizontal" gap={1} className="flex-shrink-0">
              {visibleSubitems.length > 0 && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => setCollapsed((c) => !c)}
                  title={collapsed ? 'Expand subtasks' : 'Collapse subtasks'}
                >
                  {collapsed ? '▼' : '▲'}
                </Button>
              )}
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

          {/* Move to column buttons */}
          <Stack direction="horizontal" gap={1} className="flex-wrap mb-1">
            {otherStatuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant="outline-secondary"
                onClick={() => moveStatus(s)}
              >
                → {STATUS_LABELS[s]}
              </Button>
            ))}
          </Stack>

          {/* Move to different list */}
          {otherLists.length > 0 && (
            <Form.Select
              size="sm"
              className="mt-1"
              value=""
              onChange={handleMoveList}
              disabled={movingList}
              style={{ maxWidth: 200 }}
            >
              <option value="">Move to list…</option>
              {otherLists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Form.Select>
          )}

          {/* Sub-items */}
          {!collapsed && visibleSubitems.length > 0 && (
            <Stack gap={1} className="mt-2">
              {visibleSubitems.map((sub) => (
                <SubitemCard key={sub.id} item={sub} onChanged={onChanged} />
              ))}
            </Stack>
          )}
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
