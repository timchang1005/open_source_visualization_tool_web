export function loginToGithub(user, isLoggedIn) {
  return {
    type: "LOGIN",
    user: user,
    isLoggedIn: isLoggedIn
  }
}

export function logoutFromGithub() {
  return {
    type: "LOGOUT"
  }
}