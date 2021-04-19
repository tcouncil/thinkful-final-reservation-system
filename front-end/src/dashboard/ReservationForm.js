import React from 'react';
import { useHistory } from "react-router-dom";

/**
* Reservation Form Component
* @returns {JSX.Element}
*/
export default function ReservationForm({ handleSubmit, reservation = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    people: 1,
    reservation_date: new Date().toISOString().slice(0, 10),
    reservation_time: ''
}
}) {
    let history = useHistory();

    const handleSubmission = (event) => {
        event.preventDefault();

        const updatedReservation = {
            first_name: document.querySelector('input[name="first_name"').value,
            last_name: document.querySelector('input[name="last_name"').value,
            mobile_number: document.querySelector('input[name="mobile_number"').value,
            people: Number(document.querySelector('input[name="people"').value),
            reservation_date: document.querySelector('input[name="reservation_date"').value,
            reservation_time: document.querySelector('input[name="reservation_time"').value,
            current_time: new Date().toString().slice(16, 21)
        }

        handleSubmit(event, updatedReservation);
    }

    const handleCancel = (e) => {
        e.preventDefault();

        history.goBack();
    }

    return (
        <>
            <form onSubmit={handleSubmission} className='mt-3'>
                <div className='form-group'>
                    <label htmlFor="first_name">
                        First Name
                    <input name='first_name' className='form-control' placeholder='Enter first name' defaultValue={reservation.first_name} required />
                    </label>
                </div>
                <div className='form-group'>
                    <label htmlFor="last_name">
                        Last Name
                    <input name='last_name' className='form-control' placeholder='Enter last name' defaultValue={reservation.last_name} required />
                    </label>
                </div>
                <div className='form-group'>
                    <label htmlFor="mobile_number">
                        Mobile Number
                    <input name='mobile_number' type='tel' placeholder='###-###-####' className='form-control' defaultValue={reservation.mobile_number} required />
                    </label>
                </div>
                <div className='form-group'>
                    <label htmlFor="people">
                        People
                    <input name='people' type='number' min='1' className='form-control' defaultValue={reservation.people} required />
                    </label>
                </div>
                <div className='form-group'>
                    <label htmlFor="reservation_date">
                        Date
                    <input name='reservation_date' type='date' placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className='form-control' defaultValue={reservation.reservation_date} required />
                    </label>
                </div>
                <div className='form-group'>
                    <label htmlFor="reservation_time">
                        Time
                    <input name='reservation_time' type='time' placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" className='form-control' defaultValue={reservation.reservation_time} required />
                    </label>
                </div>
                <button onClick={handleCancel} className='button mx-3 px-3'>Cancel</button>
                <button type='submit' className='button mx-3 px-3'>
                    Submit
            </button>
            </form>
        </>
    );
}