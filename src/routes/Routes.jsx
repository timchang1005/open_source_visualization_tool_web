import { Login, Home, Commits } from './../App/page';
import {
  Home as HomeIcon,
  Check as CheckIcon,
  BugReport as BugReportIcon
} from '@material-ui/icons'
import Issues from '../App/page/Issues';

const routes = [
  {path: "/", exact: true, component: Home, loginRequired: true, sidebarIcon: HomeIcon, title: "Homepage"},
  {path: "/commit", component: Commits, loginRequired: true, sidebarIcon: CheckIcon, title: "Commits"},
  {path: "/issue", component: Issues, loginRequired: true, sidebarIcon: BugReportIcon, title: "Issues"},
  {path: "/login", component: Login, loginRequired: false},
]

export default routes;