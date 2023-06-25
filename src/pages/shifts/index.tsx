import React, { Suspense, useMemo, useState } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import getShifts from "../../queries/shifts"
import {
  Backdrop,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ru"
import { DatePicker } from "@mui/x-date-pickers"
import { Button } from "@material-ui/core"

export const ShiftsList = ({
  dateFrom,
  dateTo,
  operatorId,
}: {
  dateFrom: Dayjs
  dateTo: Dayjs
  operatorId: number | null
}) => {
  const [shifts] = useQuery(getShifts, {
    DateFrom: useMemo(() => dateFrom.toISOString().substring(0, 23) + "Z", [dateFrom]),
    DateTo: useMemo(() => dateTo.toISOString().substring(0, 23) + "Z", [dateTo]),
    ...(operatorId && { OperatorId: operatorId }),
  })

  const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).locale("ru").format("DD MMMM YYYY, HH:mm:ss")
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Оператор</TableCell>
              <TableCell>Начало смены</TableCell>
              <TableCell>Конец смены</TableCell>
              {/*<TableCell>Длительность</TableCell>*/}
              <TableCell>Сумма на начало смены</TableCell>
              <TableCell>Продажи</TableCell>
              <TableCell>Депозиты</TableCell>
              <TableCell>Возвраты</TableCell>
              {/* Add more table headers for other shift properties */}
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.shiftId}>
                <TableCell>{shift.operatorName}</TableCell>
                <TableCell>{formatDateTime(shift.startTime)}</TableCell>
                <TableCell>
                  {shift.endTime ? formatDateTime(shift.endTime) : "Активная смена"}
                </TableCell>
                {/*<TableCell>{shift.duration ?? "Смена еще не завершена"}</TableCell>*/}
                <TableCell>{shift.startCash} руб</TableCell>
                {shift?.details ? (
                  <TableCell>
                    <Stack spacing={2}>
                      {shift?.details.map((detail) => (
                        <Stack key={detail.paymentMethodName} direction="row" spacing={2}>
                          <div>{detail.paymentMethodName}</div>
                          <div>{detail.sales} руб</div>
                        </Stack>
                      ))}
                    </Stack>
                  </TableCell>
                ) : null}
                {shift?.details ? (
                  <TableCell>
                    <Stack spacing={2}>
                      {shift?.details.map((detail) => (
                        <Stack key={detail.paymentMethodName} direction="row" spacing={2}>
                          {/*<div>{detail.paymentMethodName}</div>*/}
                          <div>{detail.deposits} руб</div>
                        </Stack>
                      ))}
                    </Stack>
                  </TableCell>
                ) : null}
                {shift?.details ? (
                  <TableCell>
                    <Stack spacing={2}>
                      {shift?.details.map((detail) => (
                        <Stack key={detail.paymentMethodName} direction="row" spacing={2}>
                          {/*<div>{detail.paymentMethodName}</div>*/}
                          <div>{detail.withdrawals} руб</div>
                        </Stack>
                      ))}
                    </Stack>
                  </TableCell>
                ) : null}
                {/* Add more table cells for other shift properties */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

const ShiftsPage: BlitzPage = () => {
  const [dateFrom, setDateFrom] = useState<Dayjs>(() => dayjs())
  const [dateTo, setDateTo] = useState<Dayjs>(() => dayjs().add(1, "day"))
  const [operatorId, setOperatorId] = useState<number | null>(null)

  const [stateDatePickerFrom, setStateDatePickerFrom] = useState<Dayjs | null>(() => dayjs())
  const [stateDatePickerTo, setStateDatePickerTo] = useState<Dayjs | null>(() =>
    dayjs().add(1, "day")
  )

  const startSearch = () => {
    setDateFrom(stateDatePickerFrom!)
    setDateTo(stateDatePickerTo!)
  }

  return (
    <>
      <Stack direction={"row"} spacing={2}>
        <DatePicker
          label="От"
          value={stateDatePickerFrom}
          onChange={(value, context) => setStateDatePickerFrom(value)}
        />
        <DatePicker
          label="До"
          value={stateDatePickerTo}
          onChange={(value) => setStateDatePickerTo(value)}
        />
        <Button variant={"outlined"} size={"large"} onClick={startSearch}>
          Найти
        </Button>
      </Stack>
      <div>
        <Suspense
          fallback={
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <ShiftsList dateFrom={dateFrom} dateTo={dateTo} operatorId={operatorId} />
        </Suspense>
      </div>
    </>
  )
}

ShiftsPage.authenticate = { redirectTo: Routes.LoginPage() }
ShiftsPage.getLayout = (page) => <Layout title={"Смены"}>{page}</Layout>

export default ShiftsPage
