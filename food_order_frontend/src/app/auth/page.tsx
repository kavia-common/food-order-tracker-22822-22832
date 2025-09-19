"use client";
import { useEffect, useState } from "react";
import { api, UserMe } from "@/lib/api";
import { theme } from "@/lib/theme";

export default function AuthPage() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  async function login() {
    setMsg(null);
    try {
      await api.login({ username: u, password: p });
      const user = await api.me();
      setMe(user);
      setU("");
      setP("");
      setMsg("Logged in!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed.";
      setMsg(msg);
    }
  }

  async function logout() {
    setMsg(null);
    try {
      await api.logout();
      setMe(null);
      setMsg("Logged out.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Logout failed.";
      setMsg(msg);
    }
  }

  return (
    <section
      className="rounded-2xl p-6 max-w-lg mx-auto"
      style={{ backgroundColor: theme.colors.surface, boxShadow: theme.shadows.card }}
    >
      <h2 className="text-lg font-semibold text-gray-900">Authentication</h2>
      {msg && (
        <p className="mt-2 text-sm" style={{ color: theme.colors.primary }}>
          {msg}
        </p>
      )}
      {me ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-700">
            Logged in as <strong>{me.username}</strong>
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <input
            value={u}
            onChange={(e) => setU(e.target.value)}
            placeholder="Username"
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />
          <input
            value={p}
            onChange={(e) => setP(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />
          <button
            onClick={login}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Login
          </button>
        </div>
      )}
    </section>
  );
}
