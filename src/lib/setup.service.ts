// Setup service — all calls go through the /api/setup proxy (never directly to backend)

export interface SetupStatus {
  isInstalled: boolean;
  version?: string;
}

export interface TestConnectionRequest {
  databaseProvider: string;
  connectionString: string;
}

export interface TestConnectionResponse {
  success: boolean;
  error?: string;
}

export interface SetupData {
  backendUrl?: string;
  databaseProvider?: string;
  connectionString?: string;
  database?: {
    provider: string;
    connectionString: string;
  };
  ecmApis?: {
    authUrl?: string;
    electronicOfficeUrl?: string;
    pqrsUrl?: string;
    bpmUrl?: string;
    serviceAccountUser?: string;
    serviceAccountPassword?: string;
    provider?: string;
    baseUrl?: string;
    username?: string;
    password?: string;
    repository?: string;
    useEcm?: boolean;
  };
  ecm?: {
    authUrl?: string;
    electronicOfficeUrl?: string;
    pqrsUrl?: string;
    bpmUrl?: string;
    serviceAccountUser?: string;
    serviceAccountPassword?: string;
    provider?: string;
    baseUrl?: string;
    username?: string;
    password?: string;
    repository?: string;
    useEcm?: boolean;
  };
  entidadNombre?: string;
  entidadNit?: string;
  entidad?: {
    nombre: string;
    nit: string;
    municipio?: string;
    departamento?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    sitioWeb?: string;
  };
  admin: {
    nombre?: string;
    userName: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  };
}

async function proxyGet(backendUrl: string, path: string) {
  const url = `/api/setup?backendUrl=${encodeURIComponent(backendUrl)}&path=${encodeURIComponent(path)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

async function proxyPost(backendUrl: string, path: string, body: unknown) {
  const res = await fetch("/api/setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ backendUrl, path, body }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || data?.error || `Error ${res.status}`);
  }
  return res.json().catch(() => null);
}

export async function getSetupStatus(backendUrl: string): Promise<SetupStatus> {
  return proxyGet(backendUrl, "/api/v1/setup/status");
}

export async function testConnection(
  backendUrl: string,
  data: TestConnectionRequest
): Promise<TestConnectionResponse> {
  return proxyPost(backendUrl, "/api/v1/setup/test-connection", data);
}

export async function testEcmConnection(
  backendUrl: string,
  data: { provider: string; baseUrl: string; username?: string; password?: string; repository?: string }
): Promise<TestConnectionResponse> {
  return proxyPost(backendUrl, "/api/v1/setup/test-ecm", data);
}

export async function completeSetup(
  backendUrl: string,
  data: SetupData
): Promise<{ success: boolean; message?: string }> {
  return proxyPost(backendUrl, "/api/v1/setup/complete", data);
}
