import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getUser from "src/admin/users/queries/getUser"
// import deleteUser from "src/admin/users/mutations/deleteUser";
import { Button, Card, CardContent, Typography, Box, Grid } from "@material-ui/core"
import Link from "next/link"

export const User = () => {
  const router = useRouter()
  const userId = useParam("userId", "number")
  // const [deleteUserMutation] = useMutation(deleteUser);
  const [user] = useQuery(getUser, { id: userId })

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2">
              Информация о пользователе
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              ID: {user.id}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Имя: {user.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Email: {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Роль: {user.role}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Создан: {new Date(user.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Обновлен: {new Date(user.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Link href={Routes.EditUserPage({ userId: user.id })}>
            <Button variant="contained" color="primary">
              Редактировать
            </Button>
          </Link>

          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: "0.5rem" }}
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                // await deleteUserMutation({ id: user.id });
                await router.push(Routes.UsersPage())
              }
            }}
          >
            Удалить
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

const ShowUserPage = () => {
  return (
    <Layout>
      <Head>
        <title>User Details</title>
      </Head>

      <Box mt={2} mx={4}>
        <Link href={Routes.UsersPage()}>
          <Button variant="contained" color="primary">
            Назад
          </Button>
        </Link>
      </Box>
      <Box mx={4} mt={2}>
        <Suspense fallback={<div>Loading...</div>}>
          <User />
        </Suspense>
      </Box>
    </Layout>
  )
}

ShowUserPage.authenticate = true
ShowUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowUserPage
