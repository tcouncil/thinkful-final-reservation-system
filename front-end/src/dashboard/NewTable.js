import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from 'axios';

export default function NewTable() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    let history = useHistory();

    const [tableName, setTableName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [reservationsError, setReservationsError] = useState(null);

    const handleTableName = (e) => setTableName(e.target.value);
    const handleCapacity = (e) => setCapacity(e.target.value);


    const handleSubmit = (e) => {
        e.preventDefault();

        const table = {
            table_name: tableName,
            capacity: Number(capacity),
        }

        axios.post(`${API_BASE_URL}/tables`, { data: table })
            .then(response => response.status === 201 ? history.push(`/dashboard`) : null)
            .catch(err => {
                console.error(err.response.data.error)
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
                <label htmlFor="table_name">
                    Table Name:
                    <input name='table_name' onChange={handleTableName} required />
                </label>
                <label htmlFor="capacity">
                    Capacity:
                    <input name='capacity' type='number' onChange={handleCapacity} required />
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