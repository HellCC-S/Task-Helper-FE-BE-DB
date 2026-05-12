# Task Helper

Task Helper is a small full-stack task management app. It lets users create tasks, filter them by status, move tasks through a simple workflow, and delete tasks when they are no longer needed.

## Features

- Create new tasks with a title.
- View all tasks from the backend API.
- Filter tasks by `All`, `Todo`, `In Progress`, or `Done`.
- Cycle a task status from `Todo` to `In Progress` to `Done`.
- Delete tasks.
- Persist the selected filter in `localStorage`.
- Store task data in a local SQLite database.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- CSS
- ESLint

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLite
- FastAPI CORS middleware

## Project Structure

```text
task-helper/
|-- backend/
|   |-- main.py
|   `-- task_helper.db
|-- public/
|-- src/
|   |-- components/
|   |   |-- StatusFilter.tsx
|   |   |-- TaskForm.tsx
|   |   |-- TaskItem.tsx
|   |   `-- TaskList.tsx
|   |-- App.tsx
|   |-- index.css
|   |-- main.tsx
|   `-- types.ts
|-- package.json
`-- vite.config.ts
```

## Prerequisites

- Node.js
- npm
- Python 3
- pip

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

From the project root:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn
```

On macOS or Linux, activate the virtual environment with:

```bash
source .venv/bin/activate
```

### 3. Initialize the SQLite database

From the `backend` folder:

```bash
python -c "from main import init_db; init_db()"
```

This creates the `tasks` table in `task_helper.db` if it does not already exist.

### 4. Start the backend server

From the `backend` folder:

```bash
uvicorn main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

### 5. Start the frontend development server

Open a new terminal from the project root:

```bash
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## Available Frontend Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs TypeScript build checks and creates a production build.

```bash
npm run lint
```

Runs ESLint for the project.

```bash
npm run preview
```

Serves the production build locally for preview.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check whether the backend is running. |
| `GET` | `/tasks` | Get all tasks. |
| `POST` | `/tasks` | Create a new task. |
| `PATCH` | `/tasks/{task_id}` | Move a task to the next status. |
| `DELETE` | `/tasks/{task_id}` | Delete a task. |

## Notes

- The frontend currently calls the backend at `http://127.0.0.1:8000`.
- The backend allows CORS requests from `http://localhost:5173`.
- Task statuses are limited to `Todo`, `In Progress`, and `Done`.
