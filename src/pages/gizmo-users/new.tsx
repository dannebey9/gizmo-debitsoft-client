import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreateGizmoUserSchema } from "src/gizmo-users/schemas"
import createGizmoUser from "src/gizmo-users/mutations/createGizmoUser"
import { GizmoUserForm, FORM_ERROR } from "src/gizmo-users/components/GizmoUserForm"
import { Suspense } from "react"

const NewGizmoUserPage = () => {
  const router = useRouter()
  const [createGizmoUserMutation] = useMutation(createGizmoUser)

  return (
    <Layout title={"Create New GizmoUser"}>
      <h1>Create New GizmoUser</h1>
      {/*<Suspense fallback={<div>Loading...</div>}>*/}
      {/*  <GizmoUserForm*/}
      {/*    submitText="Create GizmoUser"*/}
      {/*    schema={CreateGizmoUserSchema}*/}
      {/*    // initialValues={{}}*/}
      {/*    onSubmit={async (values) => {*/}
      {/*      try {*/}
      {/*        const gizmoUser = await createGizmoUserMutation(values)*/}
      {/*        await router.push(Routes.ShowGizmoUserPage({ gizmoUserId: gizmoUser.id }))*/}
      {/*      } catch (error: any) {*/}
      {/*        console.error(error)*/}
      {/*        return {*/}
      {/*          [FORM_ERROR]: error.toString(),*/}
      {/*        }*/}
      {/*      }*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</Suspense>*/}
      <p>
        <Link href={Routes.GizmoUsersPage()}>GizmoUsers</Link>
      </p>
    </Layout>
  )
}

NewGizmoUserPage.authenticate = { redirectTo: Routes.LoginPage() }

export default NewGizmoUserPage
