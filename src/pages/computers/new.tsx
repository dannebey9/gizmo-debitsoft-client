import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreateComputerSchema } from "src/computers/schemas"
import createComputer from "src/computers/mutations/createComputer"
import { ComputerForm, FORM_ERROR } from "src/computers/components/ComputerForm"
import { Suspense } from "react"

const NewComputerPage = () => {
  const router = useRouter()
  const [createComputerMutation] = useMutation(createComputer)

  return (
    <Layout title={"Create New Computer"}>
      <h1>Create New Computer</h1>
      {/*<Suspense fallback={<div>Loading...</div>}>*/}
      {/*  <ComputerForm*/}
      {/*    submitText="Create Computer"*/}
      {/*    schema={CreateComputerSchema}*/}
      {/*    // initialValues={{}}*/}
      {/*    onSubmit={async (values) => {*/}
      {/*      try {*/}
      {/*        const computer = await createComputerMutation(values)*/}
      {/*        await router.push(Routes.ShowComputerPage({ computerId: computer.id }))*/}
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
        <Link href={Routes.ComputersPage()}>Computers</Link>
      </p>
    </Layout>
  )
}

NewComputerPage.authenticate = { redirectTo: Routes.LoginPage() }

export default NewComputerPage
