import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Button, Card, CardContent, Typography, Box } from "@material-ui/core"
import Layout from "src/core/layouts/Layout"
import getComputer from "src/computers/queries/getComputer"
import deleteComputer from "src/computers/mutations/deleteComputer"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { Image as ImageIcon } from "@mui/icons-material"
import Image from "next/image"
import dayjs from "dayjs"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

export const Computer = () => {
  const router = useRouter()
  const computerId = useParam("computerId", "number")
  const [deleteComputerMutation] = useMutation(deleteComputer)
  const [computer] = useQuery(getComputer, { id: computerId })

  return (
    <>
      <Head>
        <title>Компьютер {computer.name}</title>
      </Head>

      <Card>
        <CardContent>
          <Typography variant="h5">Компьютер {computer.number}</Typography>
          <Typography variant="body2">{computer.name}</Typography>
          <Box my={2}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              ID: {computer.id}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Имя: {computer.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Название в Windows: {computer?.hostComputer?.windowsName}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              MAC адрес: {computer?.hostComputer?.macAddress}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {computer?.session ? (
        <Box my={2}>
          <Typography variant="h5">Сессия</Typography>
          <Typography variant="body2">{computer.session?.user?.username}</Typography>
          <Typography variant="body2">{computer.session?.user?.email}</Typography>
          <Typography variant="body2">{computer.session?.user?.mobilePhone}</Typography>
        </Box>
      ) : null}
      {computer?.processes ? (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h5">Процессы</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Иконка</TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell>Время запуска</TableCell>
                      <TableCell>Путь</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {computer?.processes?.map((process) => (
                      <TableRow key={process.id}>
                        <TableCell>
                          {process?.mainModule?.iconData ? (
                            <Image
                              src={"data:image/png;base64," + process?.mainModule?.iconData}
                              alt={"icon"}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <ImageIcon />
                          )}
                        </TableCell>
                        <TableCell>{process.processName}</TableCell>
                        <TableCell>
                          {dayjs(process.startTime).format("DD.MM.YYYY HH:mm:ss")}
                        </TableCell>
                        <TableCell>{process.mainModule.fileName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </>
      ) : null}
    </>
  )
}

const ShowComputerPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ComputersPage()}>
          <Button variant="contained" color="primary">
            Назад
          </Button>
        </Link>
      </p>

      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <Computer />
      </Suspense>
    </div>
  )
}

ShowComputerPage.authenticate = { redirectTo: Routes.LoginPage() }
ShowComputerPage.getLayout = (page) => <Layout title={"Информация о компьютере"}>{page}</Layout>

export default ShowComputerPage
