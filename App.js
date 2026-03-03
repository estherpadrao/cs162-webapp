import { Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import NewTaskPage from "./pages/NewTaskPage";

export default function App() {
  return (
    <Stack gap={3}>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewTaskPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Stack>
  );
}
