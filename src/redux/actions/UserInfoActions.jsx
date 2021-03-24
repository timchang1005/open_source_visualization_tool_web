export function storeUserInfo(user, accessToken) {
  return {
    type: "STORE_USER_INFO",
    payload: {
      user,
      accessToken
    }
  }
}

export function logout() {
  return {
    type: "LOGOUT"
  }
}