import { Suspense, useEffect, useState } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Backdrop,
  Stack,
} from "@mui/material"
import getClubUser, { IClubUser } from "../../clubs/queries/getClubUser"
import { Field, Form } from "react-final-form"
import { validateZodSchema } from "blitz"
import CreateClub from "../../clubs/mutations/createClub"
import UpdateClub from "../../clubs/mutations/updateClub"
import { CreateClubSchema } from "../../clubs/schemas"

const SettingsClub = () => {
  const [club] = useQuery(getClubUser, {})

  const [createClub, stateCreate] = useMutation(CreateClub)
  const [updateClub, stateUpdate] = useMutation(UpdateClub)

  const [editableClub, setEditableClub] = useState<IClubUser | null>(null)

  const saveClub = async (values) => {
    console.log("saveClub", values)
    // if (editableClub) {
    if (club) {
      await updateClub({
        id: club.id,
        username: values.username,
        password: values.password,
        url: values.url,
      })
    } else {
      await createClub({
        username: values.username,
        password: values.password,
        url: values.url,
      })
    }
    // }
  }

  useEffect(() => {
    setEditableClub(club)
  }, [club])
  return (
    <>
      {stateCreate.isLoading || stateUpdate.isLoading ? (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader title="Настройки клуба" />

        <CardContent>
          <Form
            validate={validateZodSchema(CreateClubSchema)}
            onSubmit={(values, form, callback) => saveClub(values)}
            initialValues={club}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <Field name={"username"} label={"Логин Gizmo"}>
                    {({ input, meta }) => (
                      <TextField
                        {...input}
                        label={"Логин Gizmo"}
                        error={meta.touched && meta.error}
                        helperText={meta.touched && meta.error ? meta.error : null}
                        variant="outlined"
                      />
                    )}
                  </Field>
                  <Field name={"password"} label={"Пароль Gizmo"}>
                    {({ input, meta }) => (
                      <TextField
                        {...input}
                        label={"Пароль Gizmo"}
                        type={"password"}
                        error={meta.touched && meta.error}
                        helperText={meta.touched && meta.error ? meta.error : null}
                        variant="outlined"
                      />
                    )}
                  </Field>
                  <Field name={"url"} label={"Адрес сервера Gizmo"}>
                    {({ input, meta }) => (
                      <TextField
                        {...input}
                        label={"Адрес сервера Gizmo"}
                        error={meta.touched && meta.error}
                        helperText={meta.touched && meta.error ? meta.error : null}
                        variant="outlined"
                      />
                    )}
                  </Field>
                  <Button type="submit" onClick={handleSubmit} fullWidth>
                    Сохранить
                  </Button>
                </Stack>
              </form>
            )}
          />
        </CardContent>
      </Card>
    </>
  )
}

const SettingsPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <SettingsClub />
      </Suspense>
    </div>
  )
}

SettingsPage.authenticate = { redirectTo: "/login" }
SettingsPage.getLayout = (page) => <Layout title={"Настройки"}>{page}</Layout>

export default SettingsPage
