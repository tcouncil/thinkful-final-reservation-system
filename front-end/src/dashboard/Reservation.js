import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function Reservation({ reservation }) {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const history = useHistory();

    const handleCancel = (e) => {
        e.preventDefault();

        if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
            axios.put(`${API_BASE_URL}/reservations/${reservation.reservation_id}/status`, { data: { status: 'cancelled' } })
                .then(response => response.status === 200 ? history.goBack() : null)
                .catch(console.error);
        }
    }

    return (
        <div>
            <p>{reservation.first_name} {reservation.last_name} - {reservation.people} - {reservation.reservation_time} #{reservation.mobile_number} {reservation.status !== 'seated' ? <b data-reservation-id-status={reservation.reservation_id}>{reservation.status}</b> : ''}
                {reservation.status === 'booked' ? <Link to={`/reservations/${reservation.reservation_id}/edit`} className='button'>Edit</Link> : ''} {reservation.status === 'booked' ? <button onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} className='button'>Cancel</button> : ''}
            </p>
            <p>{reservation.status === 'booked' ? <Link to={`/reservations/${reservation.reservation_id}/seat`} className='button'>Seat</Link> : <b data-reservation-id-status={reservation.reservation_id}>seated</b>}</p>
        </div>
    )
}