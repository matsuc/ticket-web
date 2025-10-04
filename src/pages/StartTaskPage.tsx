import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import type { Task } from "../types/task";
import { apiAvailableCourts, apiStartTask, type StartTaskInput, getErrorMessage } from "../services/api";

export default function StartTaskPage({ onCreate }: { onCreate: (t: Task) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [form, setForm] = useState<StartTaskInput>({ username: "", password: "", target_date: "", duration: 60 });
  const [loading, setLoading] = useState(false);
  const [courts, setCourts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCreate = title.trim().length > 0 && !!form.username && !!form.password && !!form.target_date && !!form.duration;

  async function handleCreate() {
    if (!canCreate) return;
    setLoading(true); setError(null);
    try {
      const { task_id } = await apiStartTask(form);
      const now = Date.now();
      const task: Task = {
        id: task_id,
        title: title.trim() || `Task ${task_id}`,
        description: description.trim() || undefined,
        status: "pending",
        progress: 0,
        createdAt: now,
        updatedAt: now,
      };
      onCreate(task);
      setTitle(""); setDescription("");
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckCourts() {
    setLoading(true); setError(null); setCourts(null);
    try {
      const res = await apiAvailableCourts(form);
      setCourts(res.courts || []);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Start a Task (via API)</h2>
        <div className="grid" style={{ gap: 10 }}>
          <label>
            <div className="small">Title</div>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Reserve court checker" />
          </label>
          <label>
            <div className="small">Description</div>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." />
          </label>

          <div className="grid cols-2">
            <label>
              <div className="small">Username</div>
              <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </label>
            <label>
              <div className="small">Password</div>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
          </div>

          <div className="grid cols-2">
            <label>
              <div className="small">Target date (YYYY-MM-DD)</div>
              <input className="input" placeholder="2025-10-04" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} />
            </label>
            <label>
              <div className="small">Duration</div>
              <input className="input" type="number" min={1} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) || 0 })} />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="primary" disabled={!canCreate || loading} onClick={handleCreate}>{loading ? "Working..." : "Create task"}</Button>
            <Button disabled={!form.username || !form.password || !form.target_date || loading} onClick={handleCheckCourts}>Check available courts</Button>
            {loading && <span className="small">Processing...</span>}
          </div>
          {error && <div className="small" style={{ color: "#b91c1c" }}>{error}</div>}
          {courts && (
            <div>
              <div className="small" style={{ marginBottom: 6 }}>Available courts:</div>
              {courts.length === 0 ? <div className="small">No courts found.</div> : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {courts.map((c, idx) => <li key={idx}>{c}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Tips</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#555" }}>
          <li>Creating a task calls <span className="kbd">POST /start_task</span> and stores the returned <code>task_id</code>.</li>
          <li>Use <em>Task status</em> to fetch latest status for each known task.</li>
          <li><span className="kbd">Check available courts</span> calls <span className="kbd">POST /available_courts</span>.</li>
        </ul>
      </Card>
    </div>
  );
}
