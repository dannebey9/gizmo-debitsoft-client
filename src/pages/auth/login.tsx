import { BlitzPage } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { LoginForm } from "src/auth/components/LoginForm"
import { useRouter } from "next/router"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <LoginForm
      onSuccess={(_user) => {
        const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
        return router.push(next)
      }}
    />
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Авторизация">{page}</Layout>

export default LoginPage
