import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateComputerSchema } from "src/computers/schemas"
import getComputer from "src/computers/queries/getComputer"
import updateComputer from "src/computers/mutations/updateComputer"
import { ComputerForm, FORM_ERROR } from "src/computers/components/ComputerForm"

export const EditComputer = () => {
  const router = useRouter()
  const computerId = useParam("computerId", "number")
  const [computer, { setQueryData }] = useQuery(
    getComputer,
    { id: computerId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateComputerMutation] = useMutation(updateComputer)

  return (
    <>
      <Head>
        <title>Edit Computer {computer.id}</title>
      </Head>

      <div>
        <h1>Edit Computer {computer.id}</h1>
        <pre>{JSON.stringify(computer, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <ComputerForm
            submitText="Update Computer"
            schema={UpdateComputerSchema}
            initialValues={computer}
            onSubmit={async (values) => {
              try {
                const updated = await updateComputerMutation({
                  id: computer.id,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(Routes.ShowComputerPage({ computerId: updated.id }))
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

const EditComputerPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditComputer />
      </Suspense>

      <p>
        <Link href={Routes.ComputersPage()}>Computers</Link>
      </p>
    </div>
  )
}

EditComputerPage.authenticate = { redirectTo: Routes.LoginPage() }
EditComputerPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditComputerPage
