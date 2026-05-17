export default async function fetchTyped<T>(
  url: string,
  config: RequestInit,
): Promise<T | undefined> {
  // in browser's fetch implementation, relative urls are resolved against the origin
  // in nodejs test environment - there is no origin, thus relative urls are invalid
  // so we just always use the full url
  const url_ = url.startsWith('http') ? url : globalThis.location.origin + url;

  const response = await fetch(url_, config);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType === 'application/json') {
    const data = await response.json();
    return data as T;
  }
  return undefined;
}
