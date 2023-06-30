import React, { createContext, useContext, useState } from "react"
import ReactDOM from "react-dom"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { generateUniqueId } from "../utils/generateUniqueId"

interface ConfirmContextProps {
  open: (config: ConfirmConfig) => void
  close: (id: string) => void
}

interface ConfirmConfig {
  id: string
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

const ConfirmContext = createContext<ConfirmContextProps>({
  open: () => {},
  close: () => {},
})

interface ConfirmProviderProps {
  children: React.ReactNode
}

const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [confirms, setConfirms] = useState<ConfirmConfig[]>([])

  const openConfirm = (config: ConfirmConfig) => {
    setConfirms((prevConfirms) => [...prevConfirms, config])
  }

  const closeConfirm = (id: string) => {
    setConfirms((prevConfirms) => prevConfirms.filter((confirm) => confirm.id !== id))
  }

  return (
    <ConfirmContext.Provider value={{ open: openConfirm, close: closeConfirm }}>
      {children}
      {confirms.map((config) => (
        <Confirm
          key={config.id}
          id={config.id}
          title={config.title}
          message={config.message}
          onConfirm={config.onConfirm}
          onCancel={config.onCancel}
          confirmText={config.confirmText}
          cancelText={config.cancelText}
        />
      ))}
    </ConfirmContext.Provider>
  )
}

const useConfirm = () => useContext(ConfirmContext)

const Confirm: React.FC<ConfirmConfig> = ({
  id,
  title,
  message,
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { close } = useConfirm()

  const handleConfirm = () => {
    close(id)
    onConfirm()
  }

  const handleCancel = () => {
    close(id)
    onCancel()
  }

  return (
    <>
      <Dialog onClose={handleCancel} open={true}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} color="primary">
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ConfirmButton: React.FC<ConfirmConfig> = ({
  id,
  title,
  message,
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { open } = useConfirm()

  const handleClick = () => {
    open({ id, title, message, onConfirm, onCancel, confirmText, cancelText })
  }

  return (
    <Button onClick={handleClick} color="primary">
      Open Confirm
    </Button>
  )
}

export { ConfirmProvider, useConfirm, ConfirmButton }
