import React from "react"
import { logoutFromGithub } from "../../redux/actions";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';

function Home({ logout, userInfo }) {
  return (
    <div>
      <h1>home</h1>
      <h2>Welcome, {userInfo.login}</h2>
      <img src={userInfo.avatar_url} alt="avatar"/>
      <br/>
      <Button variant="outlined" onClick={logout}>Logout</Button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.githubAccountInfo.isLoggedIn,
    userInfo: state.githubAccountInfo.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logoutFromGithub())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);