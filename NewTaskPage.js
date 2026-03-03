import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const BASE = process.env.REACT_APP_BASE_API_URL 

export default function NewTaskPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | error

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      const r = await fetch(`${BASE}/add`, {
        method: "POST",
        body: formData,
      });

      if (!r.ok) {
        setStatus("error");
        return;
      }

      // Flask returns { task: {...} }
      await r.json();

      navigate("/");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <Stack gap={3} className="py-3">
      <Card>
        <Card.Header className="fw-bold">New Task</Card.Header>
        <Card.Body>
          <Stack gap={3}>
            <Form onSubmit={onSubmit}>
              <Stack gap={3}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="desc">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="(optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Stack direction="horizontal" gap={2}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "saving"}
                  >
                    {status === "saving" ? "Adding..." : "Add"}
                  </Button>
                </Stack>
              </Stack>
            </Form>

            {status === "error" && (
              <Alert variant="danger" className="mb-0">
                Could not add task.
              </Alert>
            )}
          </Stack>
        </Card.Body>
      </Card>
    </Stack>
  );
}
