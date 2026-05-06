export type DatabaseProvider = 'PostgreSQL' | 'Oracle' | 'SqlServer'

export interface TestConnectionRequest {
  databaseProvider: DatabaseProvider
  connectionString: string
}

export interface TestConnectionResponse {
  success: boolean
  error?: string
}

export interface ConfigureEcmRequest {
  authUrl: string
  electronicOfficeUrl: string
  pqrsUrl: string
  bpmUrl: string
  serviceAccountUser: string
  serviceAccountPassword: string
}

export interface CreateAdminRequest {
  userName: string
  password: string
  email: string
  firstName?: string
  lastName?: string
}

export interface CompleteSetupRequest {
  databaseProvider: DatabaseProvider
  connectionString: string
  ecmApis: ConfigureEcmRequest
  entidadNombre: string
  entidadNit: string
  admin: CreateAdminRequest
}

export interface SetupStatusResponse {
  isInstalled: boolean
  installedAt?: string
  entidadNombre?: string
}

export interface WizardData {
  apiUrl: string
  database: {
    provider: DatabaseProvider
    connectionString: string
    connectionTested: boolean
    fields: Record<string, string>
  }
  ecm: ConfigureEcmRequest & { useEcm: boolean }
  entidad: {
    nombre: string
    nit: string
  }
  admin: {
    userName: string
    password: string
    passwordConfirm: string
    email: string
    firstName: string
    lastName: string
  }
}
