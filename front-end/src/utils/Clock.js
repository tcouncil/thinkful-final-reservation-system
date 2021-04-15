import React, { useState } from 'react';
import moment from 'moment';
import useInterval from './useInterval';

/**
* 12 Hour Clock Component
* @returns {JSX.Element}
*/
export default function Clock() {
    const [time, setTime] = useState(moment().format('LT'));

    useInterval(() => {
        setTime(moment().format('LT'));
    }, 1000);

    return (
        <div id="clock">
            <h5 className='mr-3'>{time}</h5>
        </div>
    )
}