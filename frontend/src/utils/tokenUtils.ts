
export function getUserIdFromToken(): number {
  const token = localStorage.getItem('access_token');
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? payload.user_id ?? payload.id ?? 0;
  } catch {
    return 0;
  }
}