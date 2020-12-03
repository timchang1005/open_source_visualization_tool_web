import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

function ProtectedRoute({ render, isLoggedIn, ...rest }) {
  return(
    <Route {...rest} render={(routeProps) => (
      isLoggedIn ? render(routeProps) : <Redirect to="/login"/>
    )}/>
  )
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.githubAccountInfo.isLoggedIn
  }
}

export default connect(mapStateToProps, null)(ProtectedRoute)