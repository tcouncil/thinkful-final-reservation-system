import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from '../dashboard/NewReservation';
import NewTable from '../dashboard/NewTable';
import ReservationSeat from '../dashboard/ReservationSeat';
import Search from '../dashboard/Search';
import Edit from '../dashboard/Edit';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard currentDate={today()} />
      </Route>
      <Route path='/reservations/new'>
        <NewReservation />
      </Route>
      <Route path='/tables/new'>
        <NewTable />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Edit />
      </Route>
      <Route path='/search'>
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
