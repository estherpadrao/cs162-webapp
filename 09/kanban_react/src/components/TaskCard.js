import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const BASE = process.env.REACT_APP_BASE_API_URL || "http://127.0.0.1:5000";

const STATUSES = ["backlog", "todo", "in-progress", "review", "done"];

export default function TaskCard({ task, onChanged }) {
  const moveTo = async (status) => {
    const formData = new FormData();
    formData.append("task_id", task.id);
    formData.append("status", status);

    await fetch(`${BASE}/move`, {
      method: "POST",
      body: formData,
    });

    onChanged?.();
  };

  const deleteTask = async () => {
    const formData = new FormData();
    formData.append("task_id", task.id);

    await fetch(`${BASE}/delete`, {
      method: "POST",
      body: formData,
    });

    onChanged?.();
  };

  return (
    <Card className="shadow-sm">
      <Card.Body className="py-2">
        <Card.Text className="mb-1">
          <b>{task.title}</b>
        </Card.Text>

        {task.description && (
          <Card.Text className="mb-2 text-muted">
            {task.description}
          </Card.Text>
        )}

        <Stack direction="horizontal" gap={2} className="flex-wrap">
          {STATUSES.filter((s) => s !== task.status).map((s) => (
            <Button
              key={s}
              size="sm"
              variant="outline-secondary"
              onClick={() => moveTo(s)}
            >
              {s}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline-danger"
            onClick={deleteTask}
          >
            delete
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
}

