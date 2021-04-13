import React, { useState } from 'react';
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from './Reservation';

export default function Search() {
    const [mobile_number, setMobileNumber] = useState('');
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const reservationsContent = reservations.map((reservation, index) => {
        return (
            <Reservation reservation={reservation} key={index} />
        )
    });

    const handleChange = (e) => setMobileNumber(e.target.value);

    const handleSearch = (e) => {
        e.preventDefault();

        const abortController = new AbortController();

        listReservations({ mobile_number }, abortController.signal)
            .then(setReservations)
            .then(() => reservationsContent.length === 0 ? setReservationsError({ message: 'No reservations found' }) : setReservationsError(null))
            .catch(setReservationsError);
    }

    return (
        <>
            <form onSubmit={handleSearch}>
                <label htmlFor='mobile_number'>
                    Search
                </label>
                <input name='mobile_number' placeholder="Enter a customer's phone number" onChange={handleChange} />
                <button type='submit'>Find</button>
            </form>
            <h3>Reservations</h3>
            {reservationsContent.length === 0 ? <ErrorAlert error={reservationsError} /> : ''}
            {reservationsContent}
        </>
    );
}