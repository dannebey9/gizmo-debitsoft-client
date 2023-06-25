// NotificationList.tsx
import { createEvent, createStore } from "effector"
import { useStore } from "effector-react"
import { Snackbar, Alert } from "@material-ui/core"
import { AlertColor } from "@material-ui/core/Alert"

type Notification = {
  id: string
  type: AlertColor
  message: string
}

// Ивенты для добавления и удаления уведомлений
const addNotification = createEvent<Omit<Notification, "id">>()
const removeNotification = createEvent<string>()

const notifications = createStore<Notification[]>([])
  .on(addNotification, (state, notification) => [
    ...state,
    { ...notification, id: `${Date.now()}-${Math.random()}` },
  ])
  .on(removeNotification, (state, id) => state.filter((notification) => notification.id !== id))

export const NotificationList = () => {
  const currentNotifications = useStore(notifications)

  return (
    <>
      {currentNotifications.map(({ id, type, message }) => (
        <Snackbar key={id} open autoHideDuration={6000} onClose={() => removeNotification(id)}>
          <Alert onClose={() => removeNotification(id)} severity={type}>
            {message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

// Функция добавления уведомлений
export const showNotification = (notification: Omit<Notification, "id">) => {
  addNotification(notification)
}
