from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cs162-dev-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False

CORS(
    app,
    supports_credentials=True,
    origins=['http://localhost:3000', 'http://127.0.0.1:3000']
)
db = SQLAlchemy(app)


# ── Models ───────────────────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    lists = db.relationship('List', backref='user', lazy=True,
                            cascade='all, delete-orphan')

    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'name': self.name}


class List(db.Model):
    __tablename__ = 'lists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    position = db.Column(db.Integer, default=0)

    def to_dict(self):
        items = Item.query.filter_by(list_id=self.id, parent_id=None) \
                          .order_by(Item.position).all()
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'items': [i.to_dict() for i in items]
        }


class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='todo')  # todo | doing | done
    list_id = db.Column(db.Integer, db.ForeignKey('lists.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=True)
    position = db.Column(db.Integer, default=0)

    subitems = db.relationship(
        'Item',
        backref=db.backref('parent', remote_side='Item.id'),
        lazy=True,
        cascade='all, delete-orphan',
        foreign_keys='Item.parent_id'
    )

    def to_dict(self, include_subitems=True):
        d = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'list_id': self.list_id,
            'parent_id': self.parent_id,
            'position': self.position,
        }
        if include_subitems:
            subs = Item.query.filter_by(parent_id=self.id) \
                             .order_by(Item.position).all()
            d['subitems'] = [s.to_dict(include_subitems=False) for s in subs]
        return d


# ── Helpers ──────────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated


def get_current_user():
    return db.session.get(User, session['user_id'])


def owns_list(list_id):
    lst = db.session.get(List, list_id)
    return lst is not None and lst.user_id == session['user_id']


def owns_item(item_id):
    item = db.session.get(Item, item_id)
    return item is not None and owns_list(item.list_id)


# ── Auth ─────────────────────────────────────────────────────────────────────

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    name = (data.get('name') or '').strip()
    password = data.get('password') or ''
    if not email or not name or not password:
        return jsonify({'error': 'All fields required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    user = User(email=email, name=name,
                password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    session['user_id'] = user.id
    return jsonify({'user': user.to_dict()}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401
    session['user_id'] = user.id
    return jsonify({'user': user.to_dict()})


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'ok': True})


@app.route('/api/profile')
@login_required
def profile():
    return jsonify({'user': get_current_user().to_dict()})


# ── Lists ─────────────────────────────────────────────────────────────────────

@app.route('/api/lists')
@login_required
def get_lists():
    user = get_current_user()
    lists = List.query.filter_by(user_id=user.id) \
                      .order_by(List.position).all()
    return jsonify({'lists': [l.to_dict() for l in lists]})


@app.route('/api/lists', methods=['POST'])
@login_required
def create_list():
    data = request.get_json()
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'Name required'}), 400
    user = get_current_user()
    max_pos = db.session.query(
        db.func.max(List.position)).filter_by(user_id=user.id).scalar() or 0
    lst = List(name=name, user_id=user.id, position=max_pos + 1)
    db.session.add(lst)
    db.session.commit()
    return jsonify({'list': lst.to_dict()}), 201


@app.route('/api/lists/<int:list_id>', methods=['PUT'])
@login_required
def rename_list(list_id):
    if not owns_list(list_id):
        return jsonify({'error': 'Forbidden'}), 403
    data = request.get_json()
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'Name required'}), 400
    lst = db.session.get(List, list_id)
    lst.name = name
    db.session.commit()
    return jsonify({'list': lst.to_dict()})


@app.route('/api/lists/<int:list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    if not owns_list(list_id):
        return jsonify({'error': 'Forbidden'}), 403
    lst = db.session.get(List, list_id)
    db.session.delete(lst)
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/lists/<int:list_id>/reorder', methods=['POST'])
@login_required
def reorder_list(list_id):
    if not owns_list(list_id):
        return jsonify({'error': 'Forbidden'}), 403
    data = request.get_json()
    direction = data.get('direction')
    user = get_current_user()
    lists = List.query.filter_by(user_id=user.id) \
                      .order_by(List.position).all()
    idx = next((i for i, l in enumerate(lists) if l.id == list_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    if direction == 'up' and idx > 0:
        lists[idx].position, lists[idx - 1].position = \
            lists[idx - 1].position, lists[idx].position
    elif direction == 'down' and idx < len(lists) - 1:
        lists[idx].position, lists[idx + 1].position = \
            lists[idx + 1].position, lists[idx].position
    db.session.commit()
    return jsonify({'ok': True})


# ── Items ─────────────────────────────────────────────────────────────────────

@app.route('/api/items', methods=['POST'])
@login_required
def create_item():
    data = request.get_json()
    title = (data.get('title') or '').strip()
    description = (data.get('description') or '').strip()
    due_date_str = data.get('due_date')
    list_id = data.get('list_id')
    parent_id = data.get('parent_id')

    if not title or not list_id:
        return jsonify({'error': 'Title and list_id required'}), 400
    if not owns_list(list_id):
        return jsonify({'error': 'Forbidden'}), 403

    if parent_id:
        parent = db.session.get(Item, parent_id)
        if not parent or parent.list_id != list_id:
            return jsonify({'error': 'Parent not in specified list'}), 400

    due_date = None
    if due_date_str:
        try:
            due_date = datetime.date.fromisoformat(due_date_str)
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400

    max_pos = db.session.query(db.func.max(Item.position)) \
                        .filter_by(list_id=list_id, parent_id=parent_id) \
                        .scalar() or 0
    item = Item(
        title=title,
        description=description or None,
        due_date=due_date,
        status='todo',
        list_id=list_id,
        parent_id=parent_id,
        position=max_pos + 1
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'item': item.to_dict()}), 201


@app.route('/api/items/<int:item_id>', methods=['PUT'])
@login_required
def edit_item(item_id):
    if not owns_item(item_id):
        return jsonify({'error': 'Forbidden'}), 403
    data = request.get_json()
    item = db.session.get(Item, item_id)
    if data.get('title'):
        item.title = data['title'].strip()
    if 'description' in data:
        item.description = (data['description'] or '').strip() or None
    if 'due_date' in data:
        if data['due_date']:
            try:
                item.due_date = datetime.date.fromisoformat(data['due_date'])
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        else:
            item.due_date = None
    db.session.commit()
    return jsonify({'item': item.to_dict()})


@app.route('/api/items/<int:item_id>', methods=['DELETE'])
@login_required
def delete_item(item_id):
    if not owns_item(item_id):
        return jsonify({'error': 'Forbidden'}), 403
    item = db.session.get(Item, item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/items/<int:item_id>/status', methods=['POST'])
@login_required
def update_status(item_id):
    if not owns_item(item_id):
        return jsonify({'error': 'Forbidden'}), 403
    data = request.get_json()
    status = data.get('status')
    if status not in ('todo', 'doing', 'done'):
        return jsonify({'error': 'Invalid status'}), 400
    item = db.session.get(Item, item_id)
    item.status = status
    db.session.commit()
    return jsonify({'item': item.to_dict()})


@app.route('/api/items/<int:item_id>/movelist', methods=['POST'])
@login_required
def move_item_list(item_id):
    if not owns_item(item_id):
        return jsonify({'error': 'Forbidden'}), 403
    data = request.get_json()
    new_list_id = data.get('list_id')
    if not new_list_id or not owns_list(new_list_id):
        return jsonify({'error': 'Forbidden'}), 403
    item = db.session.get(Item, item_id)
    if item.parent_id is not None:
        return jsonify({'error': 'Only top-level items can be moved between lists'}), 400
    item.list_id = new_list_id
    for sub in Item.query.filter_by(parent_id=item.id).all():
        sub.list_id = new_list_id
    db.session.commit()
    return jsonify({'item': item.to_dict()})


# ── Init ─────────────────────────────────────────────────────────────────────

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
