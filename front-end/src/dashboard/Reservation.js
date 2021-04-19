import React from 'react';
import { Link } from 'react-router-dom';
import { cancelReservation } from '../utils/api';

/**
* Reservation Card Component
* @param reservation
* Reservation object containing reservation information
* @returns {JSX.Element}
*/
export default function Reservation({ reservation }) {
    /**
     * Handles cancellation request
     * @param e 
     */
    const handleCancel = async (e) => {
        e.preventDefault();

        if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
            const status = await cancelReservation(reservation.reservation_id);

            if (status === 200)
                window.location.reload()
        }
    }

    /**
    * Formats 24 Hour Time into 12 Hour AM PM Clock
    * @param time
    * 24 hour time, formatted as a string "00:00"
    * @returns String formatted as "12:00 AM"
    */
    const formatTime = (time) => {
        let hour = time[0] + time[1];
        let minutes = time[3] + time[4];
        let meridiem = 'AM';
        if (Number(hour) >= 12) {
            meridiem = 'PM';
            Number(hour) === 12 ? hour = 12 : hour -= 12;
        }
        return `${hour}:${minutes} ${meridiem}`
    }

    return (
        <div className='reservationCard'>
            <div className='row justify-content-between px-3'>
                <h5 className='resName'>{reservation.first_name} {reservation.last_name}</h5>
                <div>
                    <span className="oi oi-people" />
                    &nbsp; {reservation.people}
                </div>
            </div>
            <div className='row justify-content-between px-3'>
                <div className='mx-1'>
                    <span className="oi oi-clock" />
                    &nbsp; {formatTime(reservation.reservation_time)}
                </div>
                <div className='mx-1'>
                    <span className="oi oi-phone" />
                    &nbsp; {reservation.mobile_number}
                </div>
                <div className='mx-1'>
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