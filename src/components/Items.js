import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { apiFetch, parseJsonSafe } from '../utils/api';
import ItemPost from './ItemPost';
import More from './More';

export default function Items({ content = 'feed' }) {
  const [items, setItems] = useState();
  const [pagination, setPagination] = useState();

  let url;
  switch (content) {
    case 'feed':
    case undefined:
      url = '/api/feed';
      break;
    default:
      url = `/api/users/${content}/items`;
      break;
  }

  useEffect(() => {
    (async () => {
      const response = await apiFetch(url);
      if (response.ok) {
        const body = await parseJsonSafe(response);
        setItems(body.data);
        setPagination(body.pagination);
      } else {
        setItems(null);
      }
    })();
  }, [url]);

  const loadNextPage = async () => {
    const lastItem = items[items.length - 1];
    const response = await apiFetch(url + '?after=' + encodeURIComponent(lastItem.created_at));
    if (response.ok) {
      const body = await parseJsonSafe(response);
      setItems([...items, ...body.data]);
      setPagination(body.pagination);
    }
  };

  return (
    <>
      {items === undefined ?
        <Spinner animation="border" />
      :
        <>
          {items === null ?
            <p>Could not retrieve items.</p>
          :
            <>
              {items.length === 0 ?
                <p>There are no items here yet.</p>
              :
                items.map(item => <ItemPost key={item.id} item={item} />)
              }
              <More pagination={pagination} loadNextPage={loadNextPage} />
            </>
          }
        </>
      }
    </>
  );
}
