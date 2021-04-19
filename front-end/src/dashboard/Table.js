import React from 'react';
import { finishTable } from '../utils/api';

/**
* Table Card Component
* @param table
* Table object containing table information
* @returns {JSX.Element}
*/
export default function Table({ table }) {
    const handleFinish = async (e) => {
        e.preventDefault();

        if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
            const status = await finishTable(table.table_id);

            if (status === 200)
                window.location.reload()
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