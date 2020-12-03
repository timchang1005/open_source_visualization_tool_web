import React from "react"
import { logoutFromGithub } from "../../redux/actions";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';

function Home({ logout, userInfo }) {
  return (
    <div>
      <p>home</p>
      <Button onClick={logout}>Logout</Button>
      <p>`avatar_url {userInfo.avatar_url}`</p>
      <p>`name {userInfo.login}`</p>
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