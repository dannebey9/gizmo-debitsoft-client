import { AuthClientPlugin, AuthPluginClientOptions } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"
import { BlitzRpcPlugin } from "@blitzjs/rpc"

export const authConfig: AuthPluginClientOptions = {
  cookiePrefix: "gizmo-debitsoft-client",
}

export const { withBlitz } = setupBlitzClient({
  plugins: [AuthClientPlugin(authConfig), BlitzRpcPlugin({})],
})
