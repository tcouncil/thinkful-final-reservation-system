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
            window.location.reload();
        }
    }

    const formatTime = (time) => {
        let hour = time[0] + time[1];
        let minutes = time[3] + time[4];
        let meridiem = 'AM';
        if (Number(hour) > 12) {
            meridiem = 'PM';
            hour = hour - 12;
        }
        return `${hour}:${minutes} ${meridiem}`
    }

    return (
        <div className='reservationCard'>
            <div className='row justify-content-between px-3'>
                <h5>{reservation.first_name} {reservation.last_name}</h5>
                <div>
                    <span className="oi oi-people" />
                    &nbsp; {reservation.people}
                </div>
            </div>
            <div className='row justify-content-between px-3'>
                <div>
                    <span className="oi oi-clock" />
                    &nbsp; {formatTime(reservation.reservation_time)}
                </div>
                <div>
                    <span className="oi oi-phone" />
                    &nbsp; {reservation.mobile_number}
                </div>
                <div>
                    <i data-reservation-id-status={reservation.reservation_id}>{reservation.status}</i>
                </div>
            </div>
            {reservation.status === 'booked' ?
                <div className='row justify-content-between px-3 pt-2'>
                    <Link to={`/reservations/${reservation.reservation_id}/seat`} className='sfButton p-1 px-2 '>
                        <span className="oi oi-arrow-circle-bottom" />
                            &nbsp; Seat
                        </Link>
                    <Link to={`/reservations/${reservation.reservation_id}/edit`} className='button p-1 px-2 '>
                        <span className="oi oi-pencil" />
                            &nbsp; Edit
                        </Link>
                    <button onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} className='cancelButton p-1 px-2 '>
                        <span className="oi oi-x" />
                            &nbsp; Cancel
                        </button>
                </div>
                : ''}
        </div >

    )
}