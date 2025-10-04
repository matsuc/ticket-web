import { useState } from "react";
import StartTaskPage from "./pages/StartTaskPage";
import TaskStatusPage from "./pages/TaskStatusPage";
import ProgressTasksPage from "./pages/ProgressTasksPage";
import LoginPage from "./pages/LoginPage";
import type { Task } from "./types/task";
import { useLocalTasks } from "./hooks/useLocalTasks";
import { loadCreds } from "./utils/storage";

const PAGES = ["Start task", "Task status", "All progress tasks"] as const;
type Page = typeof PAGES[number];

export default function App() {
  const [page, setPage] = useState<Page>("Start task");
  const { tasks, setTasks } = useLocalTasks();
  const [loggedIn, setLoggedIn] = useState(() => !!loadCreds());

  function addTask(t: Task) {
    setTasks(prev => [t, ...prev]);
    setPage("Task status");
  }
  function updateTask(id: string, patch: Partial<Task>) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)));
  }
  function bulkUpdate(ids: string[], patch: Partial<Task>) {
    const set = new Set(ids);
    setTasks(prev => prev.map(t => (set.has(t.id) ? { ...t, ...patch, updatedAt: Date.now() } : t)));
  }
  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }
  function clearAll() {
    if (confirm("This will delete ALL tasks locally (server tasks remain). Continue?")) setTasks([]);
  }

  // function handleLogout() {
  //   clearCreds();
  // }


  // If not logged in, show ONLY the Login page (no tabs), and gate everything else
  if (!loggedIn) {
    return (
      <div>
        <header className="app-header">
          <div className="header-brand">
            <div className="header-logo">TM</div>
            <div style={{ fontWeight: 700 }}>Ticket Superman</div>
          </div>
          {/* No navbar when unauthenticated */}
        </header>
        <main className="container">
          <LoginPage onLoggedIn={() => setLoggedIn(true)} />
        </main>
        <footer className="container footer">
          <span>Login required</span>
          <span>© {new Date().getFullYear()} Ticket Superman</span>
        </footer>
      </div>
    );
  }

  
  return (
    <div>
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">TM</div>
          <div style={{ fontWeight: 700 }}>Ticket Superman</div>
        </div>
        <nav className="navbar">
          {PAGES.map(p => (
            <button key={p} onClick={() => setPage(p)} className={page === p ? "active" : ""}>
              {p}
            </button>
          ))}
          <button onClick={clearAll} className="danger">Clear all (local)</button>
        </nav>
      </header>

      <main className="container">
        {page === "Start task" && <StartTaskPage onCreate={addTask} />}
        {page === "Task status" && (
          <TaskStatusPage tasks={tasks} onUpdate={updateTask} onBulk={bulkUpdate} onDelete={deleteTask} />
        )}
        {page === "All progress tasks" && (
          <ProgressTasksPage tasks={tasks} onUpdate={updateTask} />
        )}
      </main>

      <footer className="container footer">
        <span>Local state + Server API • Data saved locally; sync from API on demand</span>
        <span>© {new Date().getFullYear()} Task Manager</span>
      </footer>
    </div>
  );
}
