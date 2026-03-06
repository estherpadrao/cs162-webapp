from flask import Flask, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB = "kanban.db"


def get_db():
    return sqlite3.connect(DB)


@app.route("/")
def index():
    db = get_db()
    tasks = db.execute("SELECT * FROM tasks").fetchall()
    db.close()

    return {
        "tasks": [
            {
                "id": t[0],
                "title": t[1],
                "description": t[2],
                "status": t[3],
            }
            for t in tasks
        ]
    }


@app.route("/add", methods=["POST"])
def add_task():
    title = request.form["title"]
    description = request.form["description"]

    db = get_db()
    db.execute(
        "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
        (title, description, "todo"),
    )
    db.commit()

    task = db.execute(
        "SELECT * FROM tasks ORDER BY id DESC LIMIT 1"
    ).fetchone()
    db.close()

    return {
        "task": {
            "id": task[0],
            "title": task[1],
            "description": task[2],
            "status": task[3],
        }
    }, 201


@app.route("/move", methods=["POST"])
def move_task():
    task_id = request.form["task_id"]
    status = request.form["status"]

    db = get_db()
    db.execute(
        "UPDATE tasks SET status = ? WHERE id = ?",
        (status, task_id),
    )
    db.commit()

    task = db.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    db.close()

    return {
        "task": {
            "id": task[0],
            "title": task[1],
            "description": task[2],
            "status": task[3],
        }
    }


@app.route("/delete", methods=["POST"])
def delete_task():
    task_id = request.form["task_id"]

    db = get_db()
    db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    db.commit()
    db.close()

    return {"ok": True}


if __name__ == "__main__":
    app.run(debug=True)
