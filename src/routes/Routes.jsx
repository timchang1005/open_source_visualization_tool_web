import { Login, Home, Commits, Issues, Releases, Contributors, PullRequests } from './../App/page';
import {
  GoHome as HomeIcon,
  GoGitCommit as CommitIcon,
  GoTag as ReleaseIcon,
  GoIssueOpened as IssueIcon,
  GoOrganization as ContributorIcon,
  GoGitPullRequest as PullRequestIcon,
} from "react-icons/go";

const routes = [
  {path: "/", exact: true, component: Home, loginRequired: true, sidebarIcon: HomeIcon, title: "Homepage"},
  {path: "/commit", component: Commits, loginRequired: true, sidebarIcon: CommitIcon, title: "Commits"},
  {path: "/release", component: Releases, loginRequired: true, sidebarIcon: ReleaseIcon, title: "Releases"},
  {path: "/issue", component: Issues, loginRequired: true, sidebarIcon: IssueIcon, title: "Issues"},
  {path: "/pull", component: PullRequests, loginRequired: true, sidebarIcon: PullRequestIcon, title: "Pull Requests"},
  {path: "/contributor", component: Contributors, loginRequired: true, sidebarIcon: ContributorIcon, title: "Contributors"},
  {path: "/login", component: Login, loginRequired: false},
]

export default routes;