import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import TimeAgo from './TimeAgo';

const STATUS_VARIANTS = { todo: 'secondary', doing: 'warning', done: 'success' };
const STATUS_LABELS   = { todo: 'To Do',    doing: 'Doing',   done: 'Done' };

export default function ItemPost({ item }) {
  return (
    <Stack direction="horizontal" gap={3} className="ItemPost py-2 border-bottom align-items-start">
      <div
        className="rounded-circle bg-primary text-white d-flex align-items-center
                   justify-content-center fw-bold flex-shrink-0"
        style={{ width: 44, height: 44, fontSize: '1.1rem' }}
      >
        {item.user.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-grow-1">
        <p className="mb-1">
          <Link to={'/user/' + item.user.username}>
            {item.user.name}
          </Link>
          &nbsp;&mdash;&nbsp;
          <TimeAgo isoDate={item.created_at} />
          {item.list && (
            <span className="text-muted small ms-2">in <em>{item.list.name}</em></span>
          )}
        </p>
        <p className="mb-1 fw-semibold">{item.title}</p>
        {item.description && <p className="mb-1 text-muted small">{item.description}</p>}
        <Stack direction="horizontal" gap={2}>
          <Badge bg={STATUS_VARIANTS[item.status]}>{STATUS_LABELS[item.status]}</Badge>
          {item.due_date && (
            <span className="text-muted small">Due: {item.due_date}</span>
          )}
        </Stack>
      </div>
    </Stack>
  );
}
