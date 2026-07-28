const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://tareaspremi.us-east-2.elasticbeanstalk.com')
  .replace(/^http:\/\//, 'https://')
  .replace(/\/$/, '');
const API_URL = `${API_BASE_URL}/api/tareas`;

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.message || 'No se pudo completar la solicitud');
  }

  return body;
}

export function listTasks() {
  return request();
}

export function createTask(payload) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTask(id, payload) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function cancelTask(id, motivoCancelacion = '') {
  return request(`/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ motivoCancelacion }),
  });
}