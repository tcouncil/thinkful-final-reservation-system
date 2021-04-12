import React from 'react';
import { Link } from 'react-router-dom';

export default function Reservation({ reservation }) {
    return (
        <>
            <p>{reservation.status === 'booked' ? <Link to={`/reservations/${reservation.reservation_id}/seat`} className='button'>Seat</Link> : <b data-reservation-id-status={reservation.reservation_id}>seated</b>} {reservation.first_name} {reservation.last_name} - {reservation.people} - {reservation.reservation_time} #{reservation.mobile_number} {reservation.status !== 'seated' ? <b data-reservation-id-status={reservation.reservation_id}>{reservation.status}</b> : ''}</p>
        </>
    )
}