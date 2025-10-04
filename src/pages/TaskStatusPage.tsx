import { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Stat from "../components/Stat";
import type { Task } from "../types/task";
import { apiTaskStatus } from "../services/api";

export default function TaskStatusPage({ tasks, onUpdate }: { tasks: Task[]; onUpdate: (id: string, patch: Partial<Task>) => void; onBulk: (ids: string[], patch: Partial<Task>) => void; }) {
  const [query, setQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tasks;
    return tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  }, [tasks, query]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const running = tasks.filter(t => t.status === "in-progress").length;
    const paused = tasks.filter(t => t.status === "paused").length;
    const done = tasks.filter(t => t.status === "done").length;
    return { total, pending, running, paused, done };
  }, [tasks]);

  async function refreshOne(id: string) {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    try {
      const { status } = await apiTaskStatus(id);
      onUpdate(id, { status });
    } catch {
      // ignore for demo; could show toast
    } finally {
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }
  }

  async function refreshFiltered() {
    for (const t of filtered) {
      await refreshOne(t.id);
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-3">
        <Card><Stat label="Total" value={stats.total} /></Card>
        <Card><Stat label="Pending" value={stats.pending} /></Card>
        <Card><Stat label="Running" value={stats.running} /></Card>
        <Card><Stat label="Paused" value={stats.paused} /></Card>
        <Card><Stat label="Done" value={stats.done} /></Card>
      </div>

      <Card>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input className="input" style={{ flex: 1 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks by title or description..." />
          <Button onClick={refreshFiltered}>Check status from API (filtered)</Button>
        </div>

        <div className="grid" style={{ gap: 12 }}>
          {filtered.map(t => (
            <Card key={t.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>{t.title}</span>
                    <span style={{ fontSize: 12, border: "1px solid #e5e7eb", padding: "2px 8px", borderRadius: 999 }}>{t.status}</span>
                  </div>
                  {t.description && <p style={{ margin: "6px 0", color: "#555" }}>{t.description}</p>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Button onClick={() => refreshOne(t.id)}>
                    {loadingIds[t.id] ? "Checking..." : "Check status"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <div style={{ fontSize: 14, color: "#666" }}>No tasks found.</div>}
        </div>
      </Card>
    </div>
  );
}
