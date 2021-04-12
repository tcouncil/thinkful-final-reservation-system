import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from 'axios';

export default function NewReservation() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    let history = useHistory();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [people, setPeople] = useState(1);
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [reservationsError, setReservationsError] = useState(null);

    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleMobileNumber = (e) => setMobileNumber(e.target.value);
    const handlePeople = (e) => setPeople(e.target.value);
    const handleReservationDate = (e) => setReservationDate(e.target.value);
    const handleReservationTime = (e) => setReservationTime(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();

        const reservation = {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            people: Number(people),
            reservation_date: reservationDate,
            reservation_time: reservationTime
        }

        axios.post(`${API_BASE_URL}/reservations`, { data: reservation })
            .then(response => response.status === 201 ? history.push(`/dashboard?date=${reservationDate}`) : null)
            .catch(err => {
                console.log(err.response.data.error)
                setReservationsError({ message: err.response.data.error })
            }
            );
    }

    const handleCancel = (e) => {
        e.preventDefault();

        history.goBack();
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    First Name:
                    <input name='first_name' onChange={handleFirstName} required />
                </label>
                <label htmlFor="last_name">
                    Last Name:
                    <input name='last_name' onChange={handleLastName} required />
                </label>
                <label htmlFor="mobile_number">
                    Mobile Number:
                    <input name='mobile_number' onChange={handleMobileNumber} type='tel' placeholder='###-###-####' required />
                </label>
                <label htmlFor="people">
                    People:
                    <input name='people' onChange={handlePeople} type='number' required />
                </label>
                <label htmlFor="reservation_date">
                    Date:
                    <input name='reservation_date' onChange={handleReservationDate} type='date' placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" required />
                </label>
                <label htmlFor="reservation_time">
                    Time:
                    <input name='reservation_time' onChange={handleReservationTime} type='time' placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" required />
                </label>
                <button onClick={handleCancel}>Cancel</button>
                <button type='submit'>
                    Submit
            </button>
            </form>
            <ErrorAlert error={reservationsError} />
        </>
    );
}