import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from 'axios';

/**
* Edit Table Form Component
* @returns {JSX.Element}
*/
export default function NewTable() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    let history = useHistory();

    const [tableName, setTableName] = useState('');
    const [capacity, setCapacity] = useState(1);
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
        <div>
            <h2 className='text-center rtHead pb-2'>Create a New Table</h2>
            <form onSubmit={handleSubmit} className='mt-3'>
                <div className='form-group'>
                    <label htmlFor="table_name">
                        Table Name
                    <input name='table_name' placeholder='Enter table name' onChange={handleTableName} className='form-control' required />
                    </label>
                </div>
                <div className='form-group'>
                    <label htmlFor="capacity">
                        Capacity
                    <input name='capacity' type='number' min='1' onChange={handleCapacity} className='form-control' required />
                    </label>
                </div>
                <button onClick={handleCancel} className='button mx-3 px-3'>Cancel</button>
                <button type='submit' className='button mx-3 px-3'>
                    Submit
            </button>
            </form>
            <ErrorAlert error={reservationsError} />
        </div>
    );
}