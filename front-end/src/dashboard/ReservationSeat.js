import React, { useState, useEffect } from 'react';
import { listTables, readReservation, seatReservation } from "../utils/api";
import { useParams, useHistory } from 'react-router-dom';
import ErrorAlert from "../layout/ErrorAlert";

/**
* Seat reservation component
* @returns {JSX.Element}
*/
export default function ReservationSeat() {
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState(0);

    const [reservation, setReservation] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const { reservation_id } = useParams();

    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        listTables(abortController.signal)
            .then(response => {
                setTables(response);
                setTableId(response[0].table_id); // Sets our default value
            })
            .catch(error => console.error(error));

        return () => abortController.abort();
    }, []);


    // fetch Reservation
    useEffect(() => {
        async function fetchReservation() {
            const response = await readReservation(reservation_id);
            const fetchedReservation = response.data.data;

            fetchedReservation.reservation_date = fetchedReservation.reservation_date.slice(0, 10);
            fetchedReservation.reservation_time = fetchedReservation.reservation_time.slice(0, 5);

            setReservation(fetchedReservation);
        }
        fetchReservation();
    }, [reservation_id]);


    const tableOptions = tables.map((table, index) => {
        return (
            <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}{table.occupied ? ' OCCUPIED' : ''}</option>
        )
    });

    const handleChange = (e) => setTableId(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const status = await seatReservation(tableId, reservation_id);

        if (status === 200)
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        else
            setReservationsError(status);
    }

    const handleCancel = (e) => {
        e.preventDefault();

        history.goBack();
    }

    return (
        <>
            <div className='text-center'>
                <h2 className='rtHead pb-2'>Seat Reservation</h2>
                <p>Choose a table to seat the party</p>
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
            <ErrorAlert error={reservationsError} />
        </>
    )
}