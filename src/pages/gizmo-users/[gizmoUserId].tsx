import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getGizmoUser from "src/gizmo-users/queries/getGizmoUser"
import deleteGizmoUser from "src/gizmo-users/mutations/deleteGizmoUser"
import { Backdrop, CircularProgress } from "@mui/material"

export const GizmoUser = () => {
  const router = useRouter()
  const gizmoUserId = useParam("gizmoUserId", "number")
  const [deleteGizmoUserMutation] = useMutation(deleteGizmoUser)
  const [gizmoUser] = useQuery(getGizmoUser, { id: gizmoUserId })

  return (
    <>
      <Head>
        <title>GizmoUser {gizmoUser.result.id}</title>
      </Head>

      <div>
        <h1>GizmoUser {gizmoUser.result.id}</h1>
        <pre>{JSON.stringify(gizmoUser, null, 2)}</pre>

        <Link href={Routes.EditGizmoUserPage({ gizmoUserId: gizmoUser.result.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteGizmoUserMutation({ id: gizmoUser.result.id })
              await router.push(Routes.GizmoUsersPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowGizmoUserPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.GizmoUsersPage()}>GizmoUsers</Link>
      </p>

      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <GizmoUser />
      </Suspense>
    </div>
  )
}

ShowGizmoUserPage.authenticate = { redirectTo: Routes.LoginPage() }
ShowGizmoUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowGizmoUserPage
