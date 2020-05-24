import React, { useContext } from 'react';
import '../../App.sass';
import { Route, Switch } from 'react-router-dom';
import { Error404 } from '../errors';
import AdminRoutes from '../admin/routes';
import RestaurantRoutes from '../user/routes';
import Index from './index/Index';
import { AuthContext } from '../auth/AuthContextProvider';
import Search from '../../containers/search'

const App = () => {
  const auth = useContext(AuthContext);
  let userRoutes;
  let searchRoute;

  if (auth.isAuthenticated && !auth.isAdmin)
    userRoutes = <Route path="/user" component={RestaurantRoutes} />;
  if (auth.isAuthenticated && auth.isAdmin)
    userRoutes = <Route path="/admin" component={AdminRoutes} />;
  if (!auth.fetching && !auth.isAuthenticated)
    searchRoute = <Route exact path="/search" component={Search} />;

  return (
    <Switch>
        {userRoutes}
        {searchRoute}
        <Route exact path="/" component={Index} />
        <Route component={Error404} />
    </Switch>
  )
}

export default App;
