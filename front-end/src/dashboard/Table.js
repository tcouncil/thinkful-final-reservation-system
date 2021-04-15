import React from 'react';
import axios from 'axios';


/**
* Table Card Component
* @param table
* Table object containing table information
* @returns {JSX.Element}
*/
export default function Table({ table }) {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL;

    const handleFinish = (e) => {
        e.preventDefault();

        if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
            axios.delete(`${API_BASE_URL}/tables/${table.table_id}/seat`)
                .then(response => response.status === 200 ? window.location.reload() : null)
                .catch(console.error);
        }
    }

    return (
        <div className='tableCard'>
            <div className='row justify-content-between px-3'>
                <p><b>{table.table_name}</b></p>
                <p>
                    <span className="oi oi-people ml-1" />
                    &nbsp; {table.capacity}
                </p>
            </div>
            {table.occupied ?
                <div className='row justify-content-between px-3'>
                    <em data-table-id-status={table.table_id} className='pr-2'>occupied</em>
                    <button data-table-id-finish={table.table_id} onClick={handleFinish} className='sfButton ml-2 px-2'>
                        <span className="oi oi-check" />
                            &nbsp; Finish
                        </button>
                </div>
                : <em data-table-id-status={table.table_id}>free</em>}
        </div>
    )
}