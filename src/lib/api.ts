export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return null as T;
    }
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
