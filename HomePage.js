import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";

import Column from "../components/Column";

const BASE = process.env.REACT_APP_BASE_API_URL || "http://127.0.0.1:5000";

export default function HomePage() {
  const [tasks, setTasks] = useState(undefined);

  const loadTasks = async () => {
    try {
      const r = await fetch(`${BASE}/`);
      if (!r.ok) {
        setTasks(null);
        return;
      }
      const data = await r.json();
      setTasks(data.tasks || []);
    } catch (e) {
      setTasks(null);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const columns = [
    { status: "backlog", title: "BACKLOG" },
    { status: "todo", title: "TO DO" },
    { status: "in-progress", title: "IN PROGRESS" },
    { status: "review", title: "REVIEW" },
    { status: "done", title: "DONE" },
  ];

  if (tasks === undefined) return <p>Loading…</p>;
  if (tasks === null) return <p>Could not retrieve tasks.</p>;

  return (
    <Stack gap={3} className="py-3">
      <Row xs={1} md={2} lg={4} className="g-3">
        {columns.map((c) => (
          <Col key={c.status}>
            <Column
              title={c.title}
              status={c.status}
              tasks={tasks.filter((t) => t.status === c.status)}
              onChanged={loadTasks}   // ✅ pass reload down
            />
          </Col>
        ))}
      </Row>
    </Stack>
  );
}
