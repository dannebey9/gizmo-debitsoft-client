import * as process from "process"

export const env = {
  api: {
    host: process.env.GIZMO_API_URL,
    username: process.env.GIZMO_API_USERNAME,
    password: process.env.GIZMO_API_PASSWORD,
  },
  secrets: {
    SecretRegisterKey: process.env.SECRET_REGISTER_KEY,
  },
}
