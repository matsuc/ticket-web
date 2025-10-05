import { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Stat from "../components/Stat";
import type { Task } from "../types/task";
import { apiTaskStatus, apiDeleteTask } from "../services/api";

export default function TaskStatusPage({ tasks, onUpdate, onDelete }: { tasks: Task[]; onUpdate: (id: string, patch: Partial<Task>) => void; onBulk: (ids: string[], patch: Partial<Task>) => void; onDelete: (id: string) => void; }) {
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const pending = tasks.filter(t => t.status === "任務不存在或尚未開始").length;
    const running = tasks.filter(t => t.status === "進行中").length;
    const done = tasks.filter(t => t.status === "完成").length;
    return { pending, running, done };
  }, [tasks]);

  async function refreshOne(id: string) {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    try {
      const { status, result } = await apiTaskStatus(id);
      onUpdate(id, { status, result });
    } catch {
      // ignore for demo; could show toast
    } finally {
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }
  }

  async function handleDelete(id: string) {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    try {
      await apiDeleteTask(id);
      onDelete(id);
    } catch {
      // ignore for demo; could show toast
    } finally {
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }
  }


  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-3">
        <Card><Stat label="Pending" value={stats.pending} /></Card>
        <Card><Stat label="Running" value={stats.running} /></Card>
        <Card><Stat label="Done" value={stats.done} /></Card>
      </div>

      <Card>
        <div className="grid" style={{ gap: 12 }}>
          {tasks.map(t => (
            <Card key={t.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>{t.target_date}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#999" }}>{t.duration}</span>
                    <span style={{ fontSize: 12, border: "1px solid #e5e7eb", padding: "2px 8px", borderRadius: 999 }}>{t.status}</span>
                  </div>
                  {t.result && <p style={{ margin: "6px 0", color: "#555", whiteSpace: "pre-wrap" }}>{t.result}</p>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Button onClick={() => refreshOne(t.id)}>
                    {loadingIds[t.id] ? "Checking..." : "Check status"}
                  </Button>
                  {confirmId === t.id ? (
                    <>
                      <Button variant="danger" disabled={loadingIds[t.id]} onClick={() => handleDelete(t.id)}>
                        {loadingIds[t.id] ? "Deleting..." : "Confirm delete"}
                      </Button>
                      <Button onClick={() => setConfirmId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button className="danger" onClick={() => setConfirmId(t.id)}>Delete</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {tasks.length === 0 && <div style={{ fontSize: 14, color: "#666" }}>No tasks found.</div>}
        </div>
      </Card>
    </div>
  );
}
