import Head from "next/head"
import React, { FC, Suspense, useState } from "react"
import { BlitzLayout, Routes } from "@blitzjs/next"
import { NotificationList } from "../components/NotificationList"
import NoSSR from "@material-ui/core/NoSsr"
import "dayjs/locale/ru"
import PeopleIcon from "@mui/icons-material/People"
import ComputerIcon from "@mui/icons-material/Computer"
import DashboardIcon from "@mui/icons-material/Dashboard"
import MenuIcon from "@mui/icons-material/Menu"
import BadgeIcon from "@mui/icons-material/Badge"
import Link from "next/link"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import CloseIcon from "@mui/icons-material/Close"
import SettingsIcon from "@mui/icons-material/Settings"
import {
  Avatar,
  Stack,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material"
import { useRouter } from "next/router"
import { useCurrentUser } from "../../users/hooks/useCurrentUser"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import LogoutIcon from "@mui/icons-material/Logout"
import { useMutation } from "@blitzjs/rpc"
import logout from "../../auth/mutations/logout"
import { RouteUrlObject } from "blitz"
import { ConfirmProvider, useConfirm } from "../components/Confirm"
import PaymentsIcon from "@mui/icons-material/Payments"

interface ILink {
  href: RouteUrlObject
  label: string
  icon: React.ReactNode
}

const linksIfClub: ILink[] = [
  { href: Routes.Home(), label: "Главная", icon: <DashboardIcon /> },
  { href: Routes.CashPage(), label: "Касса", icon: <PaymentsIcon /> },
  { href: Routes.ComputersPage(), label: "Компьютеры", icon: <ComputerIcon /> },
  { href: Routes.GizmoUsersPage(), label: "Пользователи GIZMO", icon: <PeopleIcon /> },
  { href: Routes.ShiftsPage(), label: "Смены", icon: <BadgeIcon /> },
]

const linksAlways: ILink[] = [
  { href: Routes.SettingsPage(), label: "Настройки", icon: <SettingsIcon /> },
]

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  // const currentUser = useCurrentUser()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <NoSSR>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
        <ConfirmProvider>
          <>
            <Head>
              <title>{title || "gizmo-debitsoft-client"}</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Suspense fallback={<div>Loading...</div>}>
              <AppBarComponent title={title} handleDrawerOpen={handleDrawerOpen} />
            </Suspense>
            <NotificationList />
            <Suspense fallback={<div>Loading...</div>}>
              <Drawer
                handleDrawerOpen={() => handleDrawerOpen()}
                open={open}
                handleDrawerClose={() => handleDrawerClose()}
              />
            </Suspense>
            <main>
              {/*<Toolbar title={title} />*/}

              <Container style={{ marginTop: 15 }} maxWidth="lg">
                {children}
              </Container>
            </main>
          </>
        </ConfirmProvider>
      </LocalizationProvider>
    </NoSSR>
  )
}

interface DrawerProps {
  open: boolean
  handleDrawerClose: () => void
  handleDrawerOpen: () => void
}

interface LinkItemProps extends ILink {
  handleDrawerClose: () => void
  open: boolean
}

const LinkItem: FC<LinkItemProps> = ({ href, label, icon, handleDrawerClose, open }) => {
  const router = useRouter()
  return (
    <Link href={href}>
      <ListItemButton
        selected={router.pathname === href.pathname}
        onClick={handleDrawerClose}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            color: router.pathname === href.pathname ? "primary.main" : "inherit",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </Link>
  )
}

const Drawer: FC<DrawerProps> = ({ handleDrawerOpen, open, handleDrawerClose }) => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  if (!currentUser) return null
  return (
    <SwipeableDrawer
      anchor={"left"}
      open={open}
      onClose={handleDrawerClose}
      onOpen={handleDrawerOpen}
    >
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mx={1}>
        <Typography variant={"h6"}>DEBit Gizmo</Typography>
        <IconButton color={"primary"} size={"large"} edge={"end"} onClick={handleDrawerClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Avatar sx={{ mx: "auto", my: 2 }}>DE</Avatar>
      <List sx={{ marginTop: 10 }}>
        {currentUser.Club &&
          linksIfClub.map((link, index) => (
            <LinkItem {...link} key={index} handleDrawerClose={handleDrawerClose} open={open} />
          ))}
        {linksAlways.map((link, index) => (
          <LinkItem {...link} key={index} handleDrawerClose={handleDrawerClose} open={open} />
        ))}
      </List>
    </SwipeableDrawer>
  )
}

const AppBarComponent: FC<{ title: string | undefined; handleDrawerOpen: () => void }> = ({
  title,
  handleDrawerOpen,
}) => {
  const [logoutMutation] = useMutation(logout)
  const confirm = useConfirm()
  const router = useRouter()
  const currentUser = useCurrentUser()
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          {currentUser ? (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6">{title}</Typography>
        </Stack>
        {!currentUser ? (
          <Stack direction={"row"} spacing={2}>
            <Link href={Routes.LoginPage()}>
              <IconButton color={"inherit"} edge={"end"}>
                <LoginIcon fontSize={"large"} />
              </IconButton>
            </Link>
            <Link href={Routes.SignupPage()}>
              <IconButton color={"inherit"} edge={"end"}>
                <PersonAddIcon fontSize={"large"} />
              </IconButton>
            </Link>
          </Stack>
        ) : (
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <IconButton
              color={"inherit"}
              edge={"end"}
              onClick={async () => {
                confirm.open({
                  id: "signout",
                  title: "Вы уверены что хотите выйти?",
                  message: "Все несохраненные данные будут потеряны",
                  confirmText: "Выйти",
                  cancelText: "Отмена",
                  onConfirm: async () => {
                    await logoutMutation()
                  },
                })
              }}
            >
              <LogoutIcon fontSize={"large"} />
            </IconButton>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Layout
