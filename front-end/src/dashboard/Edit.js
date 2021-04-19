import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from '../utils/api';
import ReservationForm from './ReservationForm';

/**
* Edit Reservation Form Component
* @returns {JSX.Element}
*/
export default function Edit() {
    const [oldReservation, setOldReservation] = useState({});
    const [reservationsError, setReservationsError] = useState(null);

    const { reservation_id } = useParams();

    const history = useHistory();

    const handleSubmit = async (e, reservation) => {
        e.preventDefault();

        const status = await updateReservation(reservation, reservation_id);

        if (status === 200)
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        else
            setReservationsError(status);
    }

    // Get our reservation to set defaultValues
    useEffect(() => {
        async function fetchReservation() {
            const response = await readReservation(reservation_id);
            const fetchedReservation = response.data.data;

            // Formats the date and time strings ex: "2021-04-19T06:00:00.000Z" => "2021-04-19" && "12:30:00" => "12:30"
            fetchedReservation.reservation_date = fetchedReservation.reservation_date.slice(0, 10);
            fetchedReservation.reservation_time = fetchedReservation.reservation_time.slice(0, 5);

            setOldReservation(fetchedReservation);
        }
        fetchReservation();
    }, [reservation_id]);

    return (
        <>
            <h2 className='text-center rtHead pb-2'>Edit Reservation</h2>
            <ReservationForm handleSubmit={handleSubmit} reservation={oldReservation} />
            <ErrorAlert error={reservationsError} />
        </>
    );
}