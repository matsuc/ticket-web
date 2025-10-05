
import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { apiLogin, type LoginInput } from "../services/api";
import { saveCreds, loadCreds } from "../utils/storage";

export default function LoginPage({ onLoggedIn }: { onLoggedIn: () => void }) {
  const existing = loadCreds();
  const [form, setForm] = useState<LoginInput>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(existing ? `Currently logged in as ${existing.user_id}` : null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true); setError(null); setMsg(null);
    try {
      const { user_id } = await apiLogin(form);
      saveCreds({ user_id: user_id });
      setMsg(`Logged in as ${form.username}`);
      onLoggedIn();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !!form.username && !!form.password;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <div className="grid" style={{ gap: 10 }}>
          <label>
            <div className="small">Username</div>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </label>
          <label>
            <div className="small">Password</div>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary" disabled={!canSubmit || loading} onClick={handleLogin}>{loading ? "Logging in..." : "Login"}</Button>
          </div>
          {msg && <div className="small" style={{ color: "#047857" }}>{msg}</div>}
          {error && <div className="small" style={{ color: "#b91c1c" }}>{error}</div>}
        </div>
      </Card>
    </div>
  );
}
