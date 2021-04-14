import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from '../utils/useQuery';
import Reservation from './Reservation';
import Table from './Table';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ currentDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  const query = useQuery();
  const qDate = query.get('date');
  const date = qDate ? qDate : currentDate;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(error => console.error(error));

    return () => abortController.abort();
  }

  const reservationsContent = reservations.map((reservation, index) => {
    return (
      <Reservation reservation={reservation} key={index} />
    )
  });

  const tablesContent = tables.map((table, index) => {
    return (
      <Table table={table} key={index} />
    )
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const months = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    }
    const month = months[d.getMonth() + 1];
    const day = d.getDate();
    const year = d.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  return (
    <main>
      <h1 className='text-center mb-0'>Dashboard</h1>
      <h4 className='text-center mb-0'>{formatDate(date)}</h4>
      <ErrorAlert error={reservationsError} />
      <h3 className='text-center mb-0'>Reservations</h3>
      {reservations.length === 0 ? <><b>There are no reservations</b><br /><br /></> : ''}
      <div className='row reservations d-flex justify-content-center'>
        {reservationsContent}
      </div>
      <h3 className='text-center mb-0'>Tables</h3>
      <div className='row tables d-flex justify-content-center'>
        {tablesContent}
      </div>
    </main>
  );
}

export default Dashboard;
