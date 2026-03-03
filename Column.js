import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

import TaskCard from "./TaskCard";

function statusVariant(status) {
  if (status === "todo") return "primary";
  if (status === "in-progress") return "warning";
  if (status === "review") return "info";
  if (status === "done") return "success";
  return "secondary";
}

export default function Column({ title, status, tasks, onChanged }) {
  return (
    <Card className="h-100">
      <Card.Header className="text-center fw-bold">
        {title}{" "}
        <Badge bg={statusVariant(status)} pill>
          {tasks.length}
        </Badge>
      </Card.Header>

      <Card.Body>
        <Stack gap={2}>
          {tasks.length === 0 ? (
            <Alert variant="light" className="mb-0 text-muted">
              No tasks
            </Alert>
          ) : (
            tasks.map((t) => (
              <TaskCard key={t.id} task={t} onChanged={onChanged} />
            ))
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

