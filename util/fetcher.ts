type FetcherOptions = RequestInit & {
    json?:boolean
}

export async function Fetcher<T>(
  input: RequestInfo,
  options?: FetcherOptions
): Promise<T> {
  const res = await fetch(input, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(message || 'api 요청실패');
  }
  return options?.json === false
    ? (res as unknown as T)
    : (res.json() as Promise<T>);
}