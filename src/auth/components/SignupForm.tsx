import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core"
import { Form, Field } from "react-final-form"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import { validateZodSchema } from "blitz"
import { useSnackbar } from "notistack"
import { useCallback, useState } from "react"
import { showNotification } from "../../core/components/NotificationList"
import { CustomTextField } from "./CustomTextField"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        await signupMutation(values)
        showNotification({ type: "success", message: "Вы успешно зарегистрировались" })
        props.onSuccess?.()
      } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
          showNotification({ type: "error", message: "Эта электронная почта уже используется" })
          return { email: "Эта электронная почта уже используется" }
        } else {
          showNotification({ type: "error", message: error.toString() })
          return { [FORM_ERROR]: error.toString() }
        }
      } finally {
        setLoading(false)
      }
    },
    [signupMutation, props]
  )

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Регистрация
          </Typography>
          <Form
            onSubmit={onSubmit}
            initialValues={{
              email: "",
              password: "",
              passwordConfirmation: "",
              verificationCode: "",
            }}
            validate={validateZodSchema(Signup)}
            render={({ handleSubmit, submitError }) => (
              <form onSubmit={handleSubmit}>
                <CustomTextField name="email" label="Эл.почта" placeholder="Эл.почта" />
                <CustomTextField
                  name="verificationCode"
                  label="Код верификации"
                  placeholder="Код верификации"
                />
                <CustomTextField
                  name="password"
                  label="Пароль"
                  placeholder="Пароль"
                  type="password"
                />
                <CustomTextField
                  name="passwordConfirmation"
                  label="Повторите пароль"
                  placeholder="Повторите пароль"
                  type="password"
                />
                {submitError && <FormHelperText error>{submitError}</FormHelperText>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Зарегистрироваться"}
                </Button>
              </form>
            )}
          />
          <Box mt={2} textAlign="center">
            Уже есть аккаунт?
            <Link href={Routes.LoginPage()}>
              <Button variant="text" color="primary">
                Войти
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SignupForm
