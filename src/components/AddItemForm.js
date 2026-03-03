import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';

const BASE = process.env.REACT_APP_BASE_API_URL || 'http://127.0.0.1:5000';

export default function AddItemForm({ show, onHide, lists, onChanged }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('');
  const [isSubitem, setIsSubitem] = useState(false);
  const [parentId, setParentId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (show) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setListId(lists.length > 0 ? String(lists[0].id) : '');
      setIsSubitem(false);
      setParentId('');
      setError('');
    }
  }, [show, lists]);

  // Reset parent selection when list changes
  useEffect(() => {
    setParentId('');
  }, [listId]);

  const selectedList = lists.find((l) => l.id === parseInt(listId, 10));
  // Only top-level items (no parent) can be parents of new subitems
  const availableParents = selectedList
    ? (selectedList.items || []).filter((i) => i.parent_id === null)
    : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSubitem && !parentId) {
      setError('Please select a parent item.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate || null,
        list_id: parseInt(listId, 10),
        parent_id: isSubitem ? parseInt(parentId, 10) : null,
      };

      const r = await fetch(`${BASE}/api/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error || 'Could not add item'); return; }

      onChanged?.();
      onHide();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Item</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Stack gap={3}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group controlId="add-title">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group controlId="add-desc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="add-due">
              <Form.Label>Due date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="add-list">
              <Form.Label>List <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                required
              >
                <option value="">Select a list…</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Check
              type="checkbox"
              id="add-subitem"
              label="Add as sub-item"
              checked={isSubitem}
              onChange={(e) => setIsSubitem(e.target.checked)}
            />

            {isSubitem && (
              <Form.Group controlId="add-parent">
                <Form.Label>Parent item <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  required={isSubitem}
                >
                  <option value="">Select parent item…</option>
                  {availableParents.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </Form.Select>
                {availableParents.length === 0 && listId && (
                  <Form.Text className="text-muted">
                    No top-level items in this list yet.
                  </Form.Text>
                )}
              </Form.Group>
            )}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Adding…' : 'Add Item'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
