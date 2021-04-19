import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { next, previous } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from '../utils/useQuery';
import Reservation from './Reservation';
import Table from './Table';
import Clock from '../utils/Clock';

/**
 * Defines the dashboard page.
 * @param currentDate
 *  the current date.
 * @returns {JSX.Element}
 */
function Dashboard({ currentDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  const query = useQuery();
  const qDate = query.get('date');
  const [date, setDate] = useState(qDate ? qDate : currentDate)

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

  const handleDateChange = (e) => {
    setDate(e.target.value);
    // history.push(`/dashboard?date=${e.target.value}`);
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

    const month = months[Number(date.slice(5, 7))];
    const day = Number(date.slice(8, 11));
    const year = Number(date.slice(0, 4));

    return `${month} ${day}, ${year}`;
  }

  return (
    <main>
      <header className='d-flex justify-content-end'>
        <h5 className='text-center mb-0 mr-2'>{formatDate(currentDate)}</h5>
        <Clock />
      </header >
      <ErrorAlert error={reservationsError} />
      <h4 className='text-center rtHead'>Reservations</h4>
      <div className='text-center rtHead'>
        <div>
          <button className='button mx-2' onClick={() => setDate(previous(date))}>Prev Day</button>
          <button className='button mx-2' onClick={() => setDate(currentDate)}>Today</button>
          <button className='button mx-2' onClick={() => setDate(next(date))}>Next Day</button>
        </div>
        <input name='date' type='date' className='my-2' value={date} onChange={handleDateChange} />

      </div>
      { reservations.length === 0 ?
        <div className='text-center'><b>There are no reservations on {formatDate(date)}</b><br /><br /></div>
        :
        <div className='row reservations'>
          {reservationsContent}
        </div>}

      <h4 className='text-center rtHead'>Tables</h4>
      <div className='row tables'>
        {tablesContent}
      </div>
    </main >
  );
}

export default Dashboard;
