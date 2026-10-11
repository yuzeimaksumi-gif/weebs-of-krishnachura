// Settings the API reads from environment variables.
export type Bindings = {
  DATABASE_URL: string
  WEB_ORIGIN: string
}

export type AppEnv = { Bindings: Bindings }