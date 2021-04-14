import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ErrorAlert from "../layout/ErrorAlert";
import axios from 'axios';

export default function Edit() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const [reservation, setReservation] = useState([]);

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

    const { reservation_id } = useParams();

    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedReservation = {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            people: Number(people),
            reservation_date: reservationDate,
            reservation_time: reservationTime
        }

        axios.put(`${API_BASE_URL}/reservations/${reservation_id}`, { data: updatedReservation })
            .then(response => response.status === 200 ? history.push(`/dashboard?date=${reservationDate}`) : null)
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

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reservations/${reservation_id}`)
            .then(response => {
                const res = response.data.data;
                setReservation(response);
                setFirstName(res.first_name);
                setLastName(res.last_name);
                setMobileNumber(res.mobile_number);
                setPeople(res.people);
                setReservationDate(res.reservation_date.slice(0,10));
                setReservationTime(res.reservation_time);
            })
            .catch(console.error);
    }, [API_BASE_URL, reservation_id]);

    return (
        <>
            {reservation.data ?
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="first_name">
                            First Name:
                            <input name='first_name' onChange={handleFirstName} defaultValue={reservation.data.data.first_name} placeholder='Enter first name' className='form-control' required />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="last_name">
                            Last Name:
                         <input name='last_name' onChange={handleLastName} defaultValue={reservation.data.data.last_name} placeholder='Enter last name' className='form-control' required />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="mobile_number">
                            Mobile Number:
                            <input name='mobile_number' onChange={handleMobileNumber} defaultValue={reservation.data.data.mobile_number} type='tel' placeholder='###-###-####' className='form-control' required />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="people">
                            People:
                            <input name='people' onChange={handlePeople} type='number' min='1' defaultValue={reservation.data.data.people} className='form-control' required />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="reservation_date">
                            Date:
                            <input name='reservation_date' onChange={handleReservationDate} defaultValue={reservation.data.data.reservation_date.slice(0, 10)} type='date' placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className='form-control' required />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="reservation_time">
                            Time:
                            <input name='reservation_time' onChange={handleReservationTime} defaultValue={reservation.data.data.reservation_time} type='time' placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" className='form-control' required />
                        </label>
                    </div>
                    <button onClick={handleCancel}>Cancel</button>
                    <button type='submit'>
                        Submit
            </button>
                </form>
                : ''
            }
            <ErrorAlert error={reservationsError} />
        </>
    );
}