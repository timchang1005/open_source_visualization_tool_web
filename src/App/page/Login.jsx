import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import GithubIcon from "mdi-react/GithubIcon";
import { storeUserInfo } from "../../redux/actions";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Card, makeStyles } from "@material-ui/core";
import LoadingView from '../components/LoadingView';
import { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET, OAUTH_URL, API_URL } from '../../config'

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

function Login({ isLoggedIn, storeUserInfo }) {
  const query = new URLSearchParams(useLocation().search)
  const classes = useStyle()
  const [isLogging, setIsLogging] = useState(false)

  const loginToGithub = () => {
    let code = query.get("code")
    if(code) {
      setIsLogging(true)
      const requestData = {
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        client_secret: CLIENT_SECRET,
        code: code
      };

      axios.post(OAUTH_URL, requestData)
        .then(({ data: accessToken }) => {
          let requestData = {
            userId: null,
            accessToken
          }
          axios.post(`${API_URL}/v1/user`, requestData)
            .then(({ data: user }) => {
              storeUserInfo(user, accessToken)
            })
            .catch(err => {
              console.log(err)
              alert("Fetching user info failed")
            })
        })
        .catch(err => {
          console.error(err)
          alert("Sorry! Login failed")
        })
    }
  }

  useEffect(() => {
    loginToGithub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          href={`https://github.com/login/oauth/authorize?scope=user&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`}
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
    isLoggedIn: state.userInfo.isLoggedIn,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    storeUserInfo: (user, accessToken) => dispatch(storeUserInfo(user, accessToken)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);