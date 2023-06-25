import { TextField } from "@material-ui/core"
import { Field } from "react-final-form"

export const CustomTextField = ({ name, label, placeholder, type = "text" }) => (
  <Field name={name}>
    {(props) => (
      <TextField
        {...props.input}
        type={type}
        label={label}
        placeholder={placeholder}
        fullWidth
        margin="normal"
        error={!!props.meta.error && props.meta.touched}
        helperText={props.meta.touched && props.meta.error}
      />
    )}
  </Field>
)
