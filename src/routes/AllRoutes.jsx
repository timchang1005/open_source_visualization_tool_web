import React from 'react';
import { Route } from 'react-router-dom';
import routes from './Routes';
import ProtectedRoute from './ProtectedRoute';

export default function AllRoutes() {
  return (
    <div>
      {routes.map(({ loginRequired, path, component: Component, exact}, i) => {
        let RouteType = loginRequired ? ProtectedRoute : Route
        return (
          <RouteType 
            key={i}
            path={path}
            exact={exact}
            render={(routeProps) => 
              <Component/>
            }
          />)
      })}
    </div>
  )
}