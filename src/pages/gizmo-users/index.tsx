import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getGizmoUsers from "src/gizmo-users/queries/getGizmoUsers"
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@material-ui/core"
import { debounce } from "lodash"
import { Backdrop, CircularProgress } from "@mui/material"

const ITEMS_PER_PAGE = 100

export const GizmoUsersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const startingAfter = page * ITEMS_PER_PAGE
  const endingBefore = (page + 1) * ITEMS_PER_PAGE
  const username = router.query.username ? String(router.query.username) : undefined

  const [{ users, previousCursor, nextCursor }] = usePaginatedQuery(getGizmoUsers, {
    startingAfter: startingAfter,
    limit: ITEMS_PER_PAGE,
    endingBefore: endingBefore,
    username: username ?? "",
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1, username: username } })
  const goToNextPage = () => router.push({ query: { page: page + 1, username: username } })

  const setUserName = debounce(async (value) => {
    await router.push({ query: { username: value } })
  }, 500) // 500ms задержка

  return (
    <div>
      <TextField
        id="search"
        label="Поиск"
        variant="outlined"
        onChange={(e) => setUserName(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя пользователя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Телефон</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((gizmoUser) => (
              <TableRow key={gizmoUser.id}>
                <TableCell component="th" scope="row">
                  {gizmoUser.username}
                </TableCell>
                <TableCell>{gizmoUser.email}</TableCell>
                <TableCell>{gizmoUser.firstName}</TableCell>
                <TableCell>{gizmoUser.lastName}</TableCell>
                <TableCell>{gizmoUser.mobilePhone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button disabled={page === 0} onClick={goToPreviousPage}>
        Предыдущая страница
      </Button>
      <Button onClick={goToNextPage}>Следующая страница</Button>
    </div>
  )
}

const GizmoUsersPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <GizmoUsersList />
      </Suspense>
    </div>
  )
}

GizmoUsersPage.authenticate = { redirectTo: Routes.LoginPage() }

GizmoUsersPage.getLayout = (page) => <Layout title={"Пользователи GIZMO"}>{page}</Layout>

export default GizmoUsersPage
