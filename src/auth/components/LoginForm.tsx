import { AuthenticationError, PromiseReturnType } from "blitz"
import { Form, Field } from "react-final-form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { Box, Card, CardContent, Typography, Button } from "@material-ui/core"
import { validateZodSchema } from "blitz"
import Link from "next/link"
import { FORM_ERROR } from "final-form"
import { CustomTextField } from "./CustomTextField"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  const onSubmit = async (values) => {
    try {
      const user = await loginMutation(values)
      props.onSuccess?.(user)
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
      } else {
        return {
          [FORM_ERROR]:
            "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
        }
      }
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Авторизация
          </Typography>
          <Form
            onSubmit={onSubmit}
            initialValues={{ email: "", password: "" }}
            validate={validateZodSchema(Login)}
            render={({ handleSubmit, submitError }) => (
              <form onSubmit={handleSubmit}>
                <CustomTextField name="email" label="Эл.почта" placeholder="Эл.почта" />
                <CustomTextField
                  name="password"
                  label="Пароль"
                  placeholder="Пароль"
                  type="password"
                />
                {submitError && <div>{submitError}</div>}
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Link href={Routes.ForgotPasswordPage()}>
                    <Button variant="text" color="primary">
                      Забыли пароль?
                    </Button>
                  </Link>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Войти
                </Button>
              </form>
            )}
          />
          <Box mt={2} textAlign="center">
            Нет аккаунта?
            <Link href={Routes.SignupPage()}>
              <Button variant="text" color="primary">
                Зарегистрироваться
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginForm
