// PATH: lib/storage.ts
export function safeJsonParse<T>(v: string | null, fallback: T): T {
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function getString(key: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return v ?? fallback;
}

export function setString(key: string, value: string) {
  window.localStorage.setItem(key, value);
}

export function getBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "true";
}

export function setBool(key: string, value: boolean) {
  window.localStorage.setItem(key, String(value));
}

export function getJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return safeJsonParse<T>(window.localStorage.getItem(key), fallback);
}

export function setJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
