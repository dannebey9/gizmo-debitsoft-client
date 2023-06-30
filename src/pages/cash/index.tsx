import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import {
  Backdrop,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import getCash from "../../cash/queries/getCash"

export const CashList = () => {
  const router = useRouter()

  const [cash] = useQuery(getCash, {})

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={"row"}>
                  <Typography>Работник: {cash?.currentShift?.operatorName}</Typography>
                </Stack>
                <Stack direction={"row"}>
                  <Typography>
                    Итог:{" "}
                    {cash?.currentShift?.details?.reduce(
                      (acc, detail) => acc + detail.sales + detail.deposits - detail.refunds,
                      0
                    )}
                    ₽
                  </Typography>
                </Stack>
              </Stack>
            }
          />
        </Card>
      </Grid>

      {cash?.currentShift?.details?.map((detail) => (
        <Grid key={detail.paymentMethodName} item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader
              title={
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography>{detail.paymentMethodName}</Typography>
                  <Typography>{detail.sales + detail.deposits - detail.refunds}₽</Typography>
                </Stack>
              }
            />
            <CardContent>
              <Table size="small">
                <TableBody>
                  <TableRow hover={true}>
                    <TableCell>Продажи</TableCell>
                    <TableCell align={"right"}>{detail.sales}₽</TableCell>
                  </TableRow>
                  <TableRow hover={true}>
                    <TableCell>Депозиты</TableCell>
                    <TableCell align={"right"}>{detail.deposits}₽</TableCell>
                  </TableRow>
                  <TableRow hover={true}>
                    <TableCell>Возвраты</TableCell>
                    <TableCell align={"right"}>{detail.refunds}₽</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

const CashPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <CashList />
      </Suspense>
    </div>
  )
}

CashPage.authenticate = true
CashPage.getLayout = (page) => <Layout title={"Касса текущей смены"}>{page}</Layout>

export default CashPage
