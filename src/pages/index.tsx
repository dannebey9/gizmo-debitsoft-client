import { Suspense } from "react"
import Link from "next/link"
import { styled } from "@mui/system"
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import { Backdrop, CircularProgress } from "@mui/material"

const StyledCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
})

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return (
    <Box display="flex" justifyContent="flex-end" m={1} p={1}>
      {currentUser ? (
        <>
          <Typography variant="h6" align="right" color="textSecondary" paragraph>
            Добро пожаловать, {currentUser.email}!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              await logoutMutation()
            }}
          >
            Выйти
          </Button>
        </>
      ) : (
        <>
          <Link href={Routes.SignupPage()}>
            <Button variant="contained" color="primary">
              Регистрация
            </Button>
          </Link>
          <Link href={Routes.LoginPage()}>
            <Button variant="outlined" color="primary">
              Войти
            </Button>
          </Link>
        </>
      )}
    </Box>
  )
}

const Home: BlitzPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
        Добро пожаловать в DEBit Gizmo
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Откройте для себя мир финансовых возможностей на кончиках ваших пальцев.
      </Typography>
      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <UserInfo />
      </Suspense>
      <Grid container spacing={4}>
        {/* Заполните эти карточки своими данными */}
        {[1, 2, 3].map((card) => (
          <Grid item key={card} xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Возможность {card}
                </Typography>
                <Typography>Это краткое описание удивительной возможности.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Просмотреть
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="DEBit GIZMO">{page}</Layout>

export default Home
