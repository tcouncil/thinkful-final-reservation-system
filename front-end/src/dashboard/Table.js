import React from 'react'

export default function Table({ table }) {
    const handleFinish = (e) => {
        e.preventDefault();
        // TO DO HANDLE CONFIRMATION
    }
    return (
        <>
            <p>{table.table_name}</p>
            <p>{table.capacity}</p>
            <p data-table-id-status={table.table_id}>{table.occupied ? 'Occupied' : 'Free'}</p>
            {table.occupied ? <button data-table-id-finish={table.table_id} onClick={handleFinish}>Finish</button> : ''}
        </>
    )
}