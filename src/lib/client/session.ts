const SESSION_KEY = "pricecompare_session_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}
