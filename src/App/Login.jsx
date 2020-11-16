import React, { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import GithubIcon from "mdi-react/GithubIcon";
import { loginToGithub } from "../redux/actions";
import { connect } from "react-redux";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function Login({ login, client_id, redirect_uri, client_secret, proxy_url, isLoggedIn }) {
  const query = useQuery()

  useEffect(() => {
    let code = query.get("code")
    if(code) {
      const requestData = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        code: code
      };

      axios.post(proxy_url, requestData)
        .then(({ data }) => {
          login(data, true)
        })
        .catch(err => {
          console.error(err)
          alert("Sorry! Login failed")
        })
    }
  }, []);

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <a
        href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
      >
        <GithubIcon />
        <span>Login with GitHub</span>
      </a>
    </div>
    
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.githubAccountInfo.isLoggedIn,
    client_id: state.githubAccountInfo.client_id,
    redirect_uri: state.githubAccountInfo.redirect_uri,
    client_secret: state.githubAccountInfo.client_secret,
    proxy_url: state.githubAccountInfo.proxy_url
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (user, isLoggedIn) => dispatch(loginToGithub(user, isLoggedIn))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);