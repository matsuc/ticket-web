import { useEffect, useState } from "react";
import Card from "../components/Card";
import Stat from "../components/Stat";
import Button from "../components/Button";
import type { Task } from "../types/task";
import { apiAllProgressTasks } from "../services/api";

export default function ProgressTasksPage({ tasks, onUpdate }: { tasks: Task[]; onUpdate: (id: string, patch: Partial<Task>) => void }) {
  const [server, setServer] = useState<{ task_id: string; status: string; title?: string; description?: string }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshServer() {
    setLoading(true); setError(null);
    try {
      const list = await apiAllProgressTasks();
      const mapped = list.map(({ task_id, status }) => ({ task_id, status }));
      setServer(mapped);
      // optionally sync local known tasks' status
      mapped.forEach(item => onUpdate(item.task_id, { status: item.status }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {refreshServer();}, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-3">
        <Card><Stat label="Known tasks (local)" value={tasks.length} /></Card>
        <Card><Stat label="Server items" value={server ? server.length : 0} /></Card>
        <Card><Stat label="Last refresh" value={loading ? "Loading..." : new Date().toLocaleTimeString()} /></Card>
      </div>

      <Card>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <Button onClick={refreshServer}>{loading ? "Refreshing..." : "Refresh from API"}</Button>
          {error && <span className="small" style={{ color: "#b91c1c" }}>{error}</span>}
        </div>
        <div className="grid" style={{ gap: 12 }}>
          {server?.map(s => (
            <Card key={s.task_id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontWeight: 700 }}>{s.title || s.task_id}</div>
                  {s.description && <div className="small" style={{ margin: "6px 0" }}>{s.description}</div>}
                </div>
                <div>
                  <span className="small">Status: </span>
                  <span className="kbd">{s.status}</span>
                </div>
              </div>
            </Card>
          ))}
          {!server?.length && !loading && <div className="small">No server tasks.</div>}
        </div>
      </Card>
    </div>
  );
}
