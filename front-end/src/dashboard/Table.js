import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function Table({ table }) {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const history = useHistory();

    const handleFinish = (e) => {
        e.preventDefault();

        if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
            axios.delete(`${API_BASE_URL}/tables/${table.table_id}/seat`)
                .then(response => response.status === 200 ? history.push(`/dashboard`) : null)
                .catch(error => console.log(error));
        }
    }
    return (
        <>
            <p>{table.table_name}</p>
            <p>{table.capacity}</p>
            {table.occupied ? <p data-table-id-status={table.table_id}>occupied</p> : <p data-table-id-status={table.table_id}>free</p>}
            {table.occupied ? <button data-table-id-finish={table.table_id} onClick={handleFinish}>Finish</button> : ''}
        </>
    )
}