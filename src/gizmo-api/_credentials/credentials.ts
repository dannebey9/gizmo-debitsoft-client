import { env } from "../../../environment/env"
import db from "../../../db"

const credentials = {
  username: env.api.username,
  password: env.api.password,
}
export const encodedCredentials = Buffer.from(
  `${credentials.username}:${credentials.password}`
).toString("base64")

export const encodedCredentialsFn = (username, password) => {
  return Buffer.from(`${username}:${password}`).toString("base64")
}

export const GetFullCredentialsFromDb = async (userId) => {
  const credentials = await db.user.findFirst({
    where: { id: userId },
    select: { Club: true },
  })
  if (!credentials?.Club) throw new Error("No credentials found")
  return {
    username: credentials.Club.username,
    password: credentials.Club.password,
    url: credentials.Club.url,
  }
}

export const getConfigApi = async (userId) => {
  const credentials = await GetFullCredentialsFromDb(userId)
  return {
    headers: {
      Authorization: `Basic ${encodedCredentialsFn(credentials.username, credentials.password)}`,
    },
    url: credentials.url + "/api",
  }
}

export const getUrlApi = async (userId) => {
  const credentials = await GetFullCredentialsFromDb(userId)
  return credentials.url + "/api/"
}
