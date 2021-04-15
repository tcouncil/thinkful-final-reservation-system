import React, { useState, useEffect } from 'react';
import { listTables } from "../utils/api";
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

/**
* Seat reservation component
* @returns {JSX.Element}
*/
export default function ReservationSeat() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL;

    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState(0);

    const [reservation, setReservation] = useState([]);
    const { reservation_id } = useParams();

    const history = useHistory();

    useEffect(loadTables, []);
    useEffect(loadReservation, [API_BASE_URL, reservation_id]);

    function loadTables() {
        const abortController = new AbortController();

        listTables(abortController.signal)
            .then(response => {
                setTables(response);
                setTableId(response[0].table_id); // Sets our default value
            })
            .catch(error => console.error(error));

        return () => abortController.abort();
    }

    function loadReservation() {
        axios.get(`${API_BASE_URL}/reservations/${reservation_id}`)
            .then(setReservation)
            .catch(console.error);
    }


    const tableOptions = tables.map((table, index) => {
        return (
            <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}{table.occupied ? ' OCCUPIED' : ''}</option>
        )
    });

    const handleChange = (e) => setTableId(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (reservation_id)
            axios.put(`${API_BASE_URL}/tables/${tableId}/seat`, { data: { reservation_id: reservation_id } })
                .then(response => response.status === 200 ? history.push(`/dashboard`) : null)
                .catch(error => console.log(error));
    }

    const handleCancel = (e) => {
        e.preventDefault();

        history.goBack();
    }

    return (
        <div className='text-center'>
            <h2 className='rtHead pb-2'>Seat Reservation</h2>
            {reservation.data ?
                <p>Choose a table to seat {`${reservation.data.data.first_name} ${reservation.data.data.last_name}'s party of `}<b>{reservation.data.data.people}</b>{reservation.data.data.people > 1 ? ` people.` : ` person.`}</p>
                : ''}

            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <select
                        name='table_id'
                        onChange={handleChange}
                    >
                        {tableOptions}
                    </select>
                </div>
                <button onClick={handleCancel} className='button mx-3 px-3'>Cancel</button>
                <button type='submit' className='button mx-3 px-3'>Submit</button>
            </form>
        </div>
    )
}