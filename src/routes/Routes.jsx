import { Login, Home, Commits } from './../App/page';
import {
  Home as HomeIcon,
  Check as CheckIcon
} from '@material-ui/icons'

const routes = [
  {path: "/", exact: true, component: Home, loginRequired: true, sidebarIcon: HomeIcon, title: "Homepage"},
  {path: "/commit", component: Commits, loginRequired: true, sidebarIcon: CheckIcon, title: "Commits"},
  {path: "/login", component: Login, loginRequired: false},
]

export default routes;