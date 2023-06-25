import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { apiGetComputers, ComputerSchema } from "../../gizmo-api/Computer/apiGetComputers"
import {
  apiGetUserActiveSessions,
  UserSessionSchema,
} from "../../gizmo-api/UserSession/apiGetUserActiveSessions"
import { apiGetUser, UserSchema } from "../../gizmo-api/User/apiGetUser"
import { apiGetUserBalance, UserBalanceSchema } from "../../gizmo-api/User/apiGetUserBalance"
import {
  apiGetActiveLicense,
  LicenseSchema,
} from "../../gizmo-api/GameLicenses/apiGetActiveLicenses"
import { apiGetHostGroups, HostGroupSchema } from "../../gizmo-api/HostGroups/apiGetHostGroups"

interface GetComputersInput {
  startingAfter?: number
  endingBefore?: number
  limit?: number
}

const ComputerWithSessionAndLicenseAndGroup = ComputerSchema.extend({
  session: UserSessionSchema.nullable(),
  license: LicenseSchema.nullable(),
  group: HostGroupSchema,
})

const UserWithBalanceSchema = UserSchema.extend({
  balance: UserBalanceSchema,
})

const SessionWithUser = UserSessionSchema.extend({
  user: UserWithBalanceSchema,
})

// Типизация переменной computers
type ComputerWithSessionAndLicenseType = z.infer<typeof ComputerWithSessionAndLicenseAndGroup>
type SessionWithUserType = z.infer<typeof SessionWithUser>
type UserWithBalanceType = z.infer<typeof UserWithBalanceSchema>

export default resolver.pipe(
  resolver.authorize(),
  async ({ startingAfter, endingBefore, limit }: GetComputersInput, { session: debitSession }) => {
    try {
      const computers = await apiGetComputers(
        startingAfter,
        endingBefore,
        limit,
        debitSession.userId
      )
      const sessions = await apiGetUserActiveSessions(debitSession.userId)

      // Добавление информации о сессии пользователя в каждый компьютер
      // И выполнение запроса к API для получения пользователя по ID
      // Создание массива промисов для обработки асинхронных операций
      const promises = computers.data.map(async (computer) => {
        const session = sessions.result.find((session) => session.hostId === computer.id)

        const groups = await apiGetHostGroups(debitSession.userId)

        if (!session) {
          return {
            ...computer,
            session: undefined,
            group: groups.result.data.find((group) => group.id === computer.hostGroupId),
          }
        }

        const licenses = await apiGetActiveLicense(debitSession.userId)

        const user = await apiGetUser(session.userId, debitSession.userId)
        const userBalance = await apiGetUserBalance(session.userId, debitSession.userId)
        const userWithBalance: UserWithBalanceType = { ...user.result, balance: userBalance.result }
        const sessionWithUser: SessionWithUserType = { ...session, user: userWithBalance }

        return {
          ...computer,
          session: sessionWithUser,
          license: licenses.result.find((license) => license.hostId === computer.id),
          group: groups.result.data.find((group) => group.id === computer.hostGroupId),
        }
      })

      // Ожидание завершения всех асинхронных операций и получение окончательного результата
      const computersWithSession = await Promise.all(promises)

      const sortedComputers = computersWithSession.filter((computer) => computer.hostType === 0)

      // Sort the computers by 'number' in ascending order
      sortedComputers.sort((a, b) => a.number - b.number)

      return {
        data: sortedComputers,
        meta: computers.meta,
      }
    } catch (error) {
      console.error("Error fetching computers:", error)
      throw new Error("Failed to fetch computers.")
    }
  }
)
