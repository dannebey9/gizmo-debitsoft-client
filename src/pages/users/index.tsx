import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getUsers from "src/admin/users/queries/getUsers"
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core"
import Pagination from "../../shared/ui/Pagination"

const ITEMS_PER_PAGE = 1

export const UsersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const [{ users, count: totalCount }] = usePaginatedQuery(getUsers, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * (page - 1),
    take: ITEMS_PER_PAGE,
  })

  const handlePageChange = async (event, value) => {
    await router.push({ query: { page: value } })
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Пользователи</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Роль</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              // <Link href={Routes.ShowUserPage({ userId: user.id })}>
              <TableRow
                style={{ cursor: "pointer" }}
                key={user.id}
                hover
                onClick={() => router.push(Routes.ShowUserPage({ userId: user.id }))}
              >
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
              // </Link>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(totalCount / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
        />
      </CardContent>
    </Card>
  )
}

const UsersPage: BlitzPage = () => {
  return (
    <Layout>
      <Head>
        <title>Пользователи CRM</title>
      </Head>

      <Box mx={4} mt={2}>
        <Link href={Routes.NewUserPage()}>
          <Button variant="contained" color="primary">
            Создать пользователя
          </Button>
        </Link>

        <Box mt={2}>
          <Suspense fallback={<div>Загрузка...</div>}>
            <UsersList />
          </Suspense>
        </Box>
      </Box>
    </Layout>
  )
}

UsersPage.authenticate = { role: "USER", redirectTo: Routes.LoginPage() }
UsersPage.getLayout = (page) => <Layout>{page}</Layout>

export default UsersPage
