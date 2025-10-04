import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import type { Task } from "../types/task";
import { apiDeleteTask, getErrorMessage } from "../services/api";

export default function DeleteTaskPage({ tasks, onDelete }: { tasks: Task[]; onDelete: (id: string) => void }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id); setError(null);
    try {
      await apiDeleteTask(id);
      onDelete(id);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card>
      <h2 style={{ marginTop: 0 }}>Delete task</h2>
      {error && <div className="small" style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}
      <div className="grid" style={{ gap: 10 }}>
        {tasks.length === 0 && <div style={{ color: "#666" }}>No tasks yet.</div>}
        {tasks.map(t => (
          <div key={t.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{new Date(t.createdAt).toLocaleString()} • {t.status}</div>
            </div>
            <div>
              {confirmId === t.id ? (
                <>
                  <Button variant="danger" disabled={loadingId === t.id} onClick={() => handleDelete(t.id)}>
                    {loadingId === t.id ? "Deleting..." : "Confirm delete"}
                  </Button>
                  <Button onClick={() => setConfirmId(null)}>Cancel</Button>
                </>
              ) : (
                <Button className="danger" onClick={() => setConfirmId(t.id)}>Delete</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
