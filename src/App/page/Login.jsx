import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import GithubIcon from "mdi-react/GithubIcon";
import { loginToGithub } from "../../redux/actions";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Card, makeStyles } from "@material-ui/core";
import LoadingView from '../components/LoadingView';

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    minWidth: 500,
    margin: 100,
    display: 'flex',
    justifyContent: 'center',
    padding: 50
  },
  loginButton: {
    fontSize: 20,
    color: 'white',
    background: 'black',
    "&:hover": {
      background: 'gray'
    }
  }
}))

function Login({ login, client_id, redirect_uri, client_secret, proxy_url, isLoggedIn }) {
  const query = new URLSearchParams(useLocation().search)
  const classes = useStyle()
  const [isLogging, setIsLogging] = useState(false)

  useEffect(() => {
    let code = query.get("code")
    if(code) {
      setIsLogging(true)
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
    <div className={classes.root}>
      <LoadingView visible={isLogging}/>
      <Card className={classes.card}>
        <Button 
          variant="outlined"
          className={classes.loginButton}
          href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
        >
          <GithubIcon/>
          login to github
        </Button>
      </Card>
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