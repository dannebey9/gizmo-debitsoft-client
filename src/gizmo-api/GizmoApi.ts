import ky from "ky"
import { env } from "../../environment/env"
import { encodedCredentials, getConfigApi } from "./_credentials/credentials"
import { KyInstance } from "ky/distribution/types/ky"

export const gizmoApi = ky.create({})
// .extend({
//   hooks: {
//     beforeRequest: [
//       async (request) => {
//         const userId = request.headers.get("usr")
//         if (userId) {
//           const config = await getConfigApi(userId)
//           request.headers.set("Authorization", `Basic ${config.headers.Authorization}`)
//         }
//       },
//     ],
//   },
// })

export const gizmoApiWithUser = async (): Promise<KyInstance> => {
  const gizmoApi = ky.create({
    prefixUrl: `${env.api.host}/api`,
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  })
  return gizmoApi
}
