import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import ListBlock from '../components/ListBlock';
import AddItemForm from '../components/AddItemForm';

const BASE = process.env.REACT_APP_BASE_API_URL || 'http://127.0.0.1:5000';

export default function ListsPage() {
  const [lists, setLists] = useState(undefined);
  const [showAddItem, setShowAddItem] = useState(false);
  const [addingList, setAddingList] = useState(false);

  const loadLists = async () => {
    try {
      const r = await fetch(`${BASE}/api/lists`, { credentials: 'include' });
      if (!r.ok) { setLists(null); return; }
      const data = await r.json();
      setLists(data.lists || []);
    } catch {
      setLists(null);
    }
  };

  useEffect(() => { loadLists(); }, []);

  const handleAddList = async () => {
    const name = window.prompt('New list name:');
    if (!name || !name.trim()) return;
    setAddingList(true);
    try {
      const r = await fetch(`${BASE}/api/lists`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (r.ok) await loadLists();
    } finally {
      setAddingList(false);
    }
  };

  if (lists === undefined) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (lists === null) {
    return <Alert variant="danger">Could not load your lists. Please refresh.</Alert>;
  }

  return (
    <Stack gap={4}>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0 fw-bold">My Lists</h2>
        <Button variant="primary" onClick={() => setShowAddItem(true)}>
          + Add Item
        </Button>
      </div>

      {lists.length === 0 && (
        <Alert variant="light" className="text-muted text-center">
          No lists yet. Create your first list below!
        </Alert>
      )}

      {lists.map((list, idx) => (
        <ListBlock
          key={list.id}
          list={list}
          lists={lists}
          isFirst={idx === 0}
          isLast={idx === lists.length - 1}
          onChanged={loadLists}
        />
      ))}

      <div className="text-center">
        <Button
          variant="outline-primary"
          onClick={handleAddList}
          disabled={addingList}
        >
          {addingList ? 'Creating…' : '+ New List'}
        </Button>
      </div>

      <AddItemForm
        show={showAddItem}
        onHide={() => setShowAddItem(false)}
        lists={lists}
        onChanged={loadLists}
      />
    </Stack>
  );
}
