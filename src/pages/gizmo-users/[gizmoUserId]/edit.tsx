import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateGizmoUserSchema } from "src/gizmo-users/schemas"
import getGizmoUser from "src/gizmo-users/queries/getGizmoUser"
import updateGizmoUser from "src/gizmo-users/mutations/updateGizmoUser"
import { GizmoUserForm, FORM_ERROR } from "src/gizmo-users/components/GizmoUserForm"

export const EditGizmoUser = () => {
  const router = useRouter()
  const gizmoUserId = useParam("gizmoUserId", "number")
  const [gizmoUser, { setQueryData }] = useQuery(
    getGizmoUser,
    { id: gizmoUserId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateGizmoUserMutation] = useMutation(updateGizmoUser)

  return (
    <>
      <Head>
        <title>Edit GizmoUser {gizmoUser.id}</title>
      </Head>

      <div>
        <h1>Edit GizmoUser {gizmoUser.id}</h1>
        <pre>{JSON.stringify(gizmoUser, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <GizmoUserForm
            submitText="Update GizmoUser"
            schema={UpdateGizmoUserSchema}
            initialValues={gizmoUser}
            onSubmit={async (values) => {
              try {
                const updated = await updateGizmoUserMutation({
                  id: gizmoUser.id,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(Routes.ShowGizmoUserPage({ gizmoUserId: updated.id }))
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}

const EditGizmoUserPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditGizmoUser />
      </Suspense>

      <p>
        <Link href={Routes.GizmoUsersPage()}>GizmoUsers</Link>
      </p>
    </div>
  )
}

EditGizmoUserPage.authenticate = { redirectTo: Routes.LoginPage() }
EditGizmoUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditGizmoUserPage
