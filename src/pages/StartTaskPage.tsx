import { useEffect, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import type { Task } from "../types/task";
import { apiAvailableCourts, apiStartTask, type StartTaskInput, getErrorMessage } from "../services/api";
import { loadCreds } from "../utils/storage";

export default function StartTaskPage({ onCreate }: { onCreate: (t: Task) => void }) {
  const creds = loadCreds();
  const [form, setForm] = useState<StartTaskInput & { date: string; time: string }>({
    user_id: creds?.user_id || "",
    target_date: "2025-10-01T12:00:00",
    date: "2025-10-01",
    time: "12",
    duration: 120,
  });
  const [loading, setLoading] = useState(false);
  const [courts, setCourts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCreate = !!form.target_date && !!form.duration;


  useEffect(() => {
    if (form.date && form.time) {
      setForm((prev) => ({
        ...prev,
        target_date: `${form.date}T${form.time}:00`,
      }));
    }
  }, [form.date, form.time]);

  async function handleCreate() {
    if (!canCreate) return;
    setLoading(true); setError(null);
    try {
      const available = await handleCheckCourts();
      if (!available || available.length === 0) {
        setError("No available courts found for the selected date and duration.");
        setLoading(false);
        return;
      }
      console.log(form);

      const { task_id } = await apiStartTask(form);
      const now = Date.now();
      const task: Task = {
        id: task_id,
        status: "pending",
        target_date: form.target_date,
        duration: form.duration,
        createdAt: now,
        updatedAt: now,
      };
      onCreate(task);
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
      const available = res.available_courts || [];
      setCourts(available);
      return available;
    } catch (e: unknown) {
      setError(getErrorMessage(e));
      return [];
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Start a Task (via API)</h2>
        <div className="grid" style={{ gap: 10, maxWidth: 900 }}>

          <div className="grid cols-2">
            {/* 日期選擇 */}
            <label>
              <div className="small">Date</div>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>

            {/* 時間 */}
            <label>
              <div className="small">Time</div>
              <input
                type="time"
                className="input"
                value={form.time}
                step="3600" // 一小時 = 3600 秒
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </label>

            {/* Duration 下拉選單 */}
            <label>
              <div className="small">Duration (minutes)</div>
              <select
                className="input"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              >
                <option value={60}>60</option>
                <option value={120}>120</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="primary" disabled={!canCreate || loading} onClick={handleCreate}>{loading ? "Working..." : "Create task"}</Button>
            <Button disabled={!form.target_date || loading } onClick={handleCheckCourts}>Check available courts</Button>
            {loading && <span className="small">Processing...</span>}
          </div>
          {error && <div className="small" style={{ color: "#b91c1c" }}>{error}</div>}
          {courts && (
            <div>
              <div className="small" style={{ marginBottom: 6 }}>Available courts:</div>
              {courts.length === 0 ? <div className="small">No courts found.</div> : (
                <div className="small">{courts.join("、")}</div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
