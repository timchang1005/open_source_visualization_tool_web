const initState = {
  isLoggedIn: localStorage.getItem("accessToken") !== null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null
}

const userInfoReducer = (state = initState, action) => {
  switch(action.type) {
    case "STORE_USER_INFO": {
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      localStorage.setItem("accessToken", action.payload.accessToken)

      return {
        ...state,
        isLoggedIn: true,
        ...action.payload
      }
    }
    case "LOGOUT": {
      localStorage.clear()

      return {
        isLoggedIn: false,
        user: null,
        token: null
      }
    }
    default:
      return state
  }
}

export default userInfoReducer;