import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getComputers from "src/computers/queries/getComputers"
import { Grid, Card, CardContent, Button, Typography } from "@material-ui/core"
import TimeDisplay from "../../shared/ui/TimeDisplay"
import {
  Backdrop,
  Box,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/material"
import dayjs from "dayjs"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { useConfirm } from "../../core/components/Confirm"

const ITEMS_PER_PAGE = 100

function formatTimeFromSeconds(seconds) {
  // Перевести секунды в HH:mm
  return dayjs().startOf("day").add(seconds, "seconds").format("HH:mm")
}

export const ComputersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ data: computers, meta }] = usePaginatedQuery(getComputers, {
    endingBefore: page * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    startingAfter: (page - 1) * ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const confirm = useConfirm()

  const isTimeCritical = (AvailTime: number) => AvailTime <= 5 * 60

  const countComputersWithSession = () => {
    let count = 0
    computers.forEach((computer) => {
      if (computer.session) {
        count++
      }
    })
    return count
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Chip
          label={`Занято ${countComputersWithSession()} из ${computers.length}`}
          color={"primary"}
          variant={"outlined"}
        />
      </Box>
      <Grid container spacing={2} alignItems={"stretch"}>
        {computers.map((computer) => (
          <Grid key={computer.id} item xs={12} sm={6} md={4} lg={3} height={"100%"}>
            <Card
              style={{ backgroundColor: computer.session ? "white" : "#D3D3D3" }}
              variant={"outlined"}
            >
              {computer.session ? (
                <>
                  <LinearProgress
                    value={
                      100 -
                      (computer?.session.user.balance.availableTime /
                        (computer?.session.user.balance.availableTime +
                          computer?.session.billedSpan)) *
                        100
                    }
                    variant="determinate"
                    color={
                      isTimeCritical(computer?.session.user.balance.availableTime)
                        ? "error"
                        : "primary"
                    }
                  />
                  <Stack
                    direction="row"
                    spacing={2}
                    paddingX={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography color="textSecondary" fontSize={"smaller"}>
                      {formatTimeFromSeconds(computer?.session.billedSpan)}
                    </Typography>

                    <Typography color={"gray"} fontSize={"large"}>
                      {computer?.session?.user?.isGuest
                        ? "Гость"
                        : computer?.session?.user?.username}
                    </Typography>
                    <Typography color="textSecondary" fontSize={"smaller"}>
                      {formatTimeFromSeconds(computer?.session.user.balance.availableTime)}
                    </Typography>
                  </Stack>
                </>
              ) : null}
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    flexWrap={"wrap"}
                    spacing={2}
                    alignItems="center"
                    justifyContent="start"
                  >
                    <Typography noWrap={true} color={"black"} fontSize={"large"}>
                      {computer.name}
                    </Typography>
                    <Chip
                      size={"small"}
                      color={"primary"}
                      variant={"outlined"}
                      label={computer?.group?.name}
                    />
                    <Chip
                      color={computer?.session ? "error" : "success"}
                      size={"small"}
                      variant={"outlined"}
                      label={computer?.session ? "Занят" : "Свободен"}
                    />
                  </Stack>
                }
              />
              <CardContent>
                <Stack direction="column">
                  {computer?.session ? (
                    <>
                      <Typography color="green" textAlign={"center"} fontSize={"larger"}>
                        {computer?.session.user.balance.balance} ₽
                      </Typography>
                      {computer?.license ? (
                        <>
                          <Divider />
                          <Stack>
                            <Typography
                              fontSize={"smaller"}
                              textAlign={"center"}
                              color="textSecondary"
                            >
                              Выдана лицензия
                            </Typography>
                            <Typography textAlign={"center"} color="textSecondary">
                              {`${computer?.license.application} - ${computer?.license.licenseKey}`}
                            </Typography>
                          </Stack>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {computer?.session ? (
                    <Stack direction="row" spacing={2} justifyContent={"center"}>
                      <IconButton
                        onClick={() =>
                          confirm.open({
                            title: `Выключение ${computer.name}`,
                            message: `Вы действительно хотите выключить ${computer.name}?`,
                            onConfirm: () => console.log("Выключение"),
                            id: computer.id + "shutdown",
                          })
                        }
                      >
                        <PowerSettingsNewIcon />
                      </IconButton>
                    </Stack>
                  ) : null}
                  <Link href={Routes.ShowComputerPage({ computerId: computer.id })} passHref>
                    <Button fullWidth>Подробнее</Button>
                  </Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

const ComputersPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <ComputersList />
      </Suspense>
    </div>
  )
}

ComputersPage.authenticate = { redirectTo: Routes.LoginPage() }

ComputersPage.getLayout = (page) => <Layout title={"Компьютеры"}>{page}</Layout>

export default ComputersPage
