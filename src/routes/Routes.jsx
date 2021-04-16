import { Login, Home, Commits, Issues, Releases } from './../App/page';
import {
  Home as HomeIcon,
  Check as CommitIcon,
  BugReport as IssueIcon,
  LocalOffer as ReleaseIcon
} from '@material-ui/icons'

const routes = [
  {path: "/", exact: true, component: Home, loginRequired: true, sidebarIcon: HomeIcon, title: "Homepage"},
  {path: "/commit", component: Commits, loginRequired: true, sidebarIcon: CommitIcon, title: "Commits"},
  {path: "/release", component: Releases, loginRequired: true, sidebarIcon: ReleaseIcon, title: "Releases"},
  {path: "/issue", component: Issues, loginRequired: true, sidebarIcon: IssueIcon, title: "Issues"},
  {path: "/login", component: Login, loginRequired: false},
]

export default routes;