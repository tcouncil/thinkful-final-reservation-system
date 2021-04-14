import React from 'react';
import axios from 'axios';

export default function Table({ table }) {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const handleFinish = (e) => {
        e.preventDefault();

        if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
            axios.delete(`${API_BASE_URL}/tables/${table.table_id}/seat`)
                .then(response => response.status === 200 ? window.location.reload() : null)
                .catch(console.error);
        }
    }

    return (
        <div className='col-2 tableCard'>
            <div className='row justify-content-between px-3'>
                <p><b>{table.table_name}</b></p>
                <p>
                    <span className="oi oi-people" />
                    &nbsp; {table.capacity}
                </p>
            </div>
            {table.occupied ?
                <div>
                    <em data-table-id-status={table.table_id}>occupied</em>
                    <button data-table-id-finish={table.table_id} onClick={handleFinish}>Finish</button>
                </div>
                : <em data-table-id-status={table.table_id}>free</em>}
        </div>
    )
}