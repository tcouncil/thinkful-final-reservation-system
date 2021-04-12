import React, { useState, useEffect } from 'react';
import { listTables } from "../utils/api";
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

export default function ReservationSeat() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState(1);
    const { reservation_id } = useParams();

    const history = useHistory();

    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController();

        listTables(abortController.signal)
            .then(setTables)
            .catch(error => console.error(error));

        return () => abortController.abort();
    }


    const tableOptions = tables.map((table, index) => {
        return (
            <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}</option>
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
        <>
            <form onSubmit={handleSubmit}>
                <select
                    name='table_id'
                    onChange={handleChange}
                >
                    {tableOptions}
                </select>
                <button onClick={handleCancel}>Cancel</button>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}