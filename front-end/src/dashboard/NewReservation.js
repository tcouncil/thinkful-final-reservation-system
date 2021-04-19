import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from '../utils/api';
import ReservationForm from './ReservationForm';

/**
* New Reservation Form Component
* @returns {JSX.Element}
*/
export default function NewReservation() {
    let history = useHistory();

    const [reservationsError, setReservationsError] = useState(null);

    const handleSubmit = async (e, reservation) => {
        e.preventDefault();

        const status = await createReservation(reservation);

        if (status === 'booked')
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        else
            setReservationsError(status);
    }

    return (
        <>
            <h2 className='text-center rtHead pb-2'>Create a New Reservation</h2>
            <ReservationForm handleSubmit={handleSubmit} />
            <ErrorAlert error={reservationsError} />
        </>
    );
}