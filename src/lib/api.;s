export async function fetchWithAuth(endpoint) {
  const token = localStorage.getItem('authToken');

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch protected data');
  }

  return response.json();
}
