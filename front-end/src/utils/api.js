import axios from 'axios';

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservations.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Updates a reservation.
 * @param reservation 
 * @param reservation_id 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of a updated reservation saved in the database.
 */
export async function readReservation(reservation_id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations/${reservation_id}`);
    return response;
  }
  catch (error) {
    return { message: error.response.data.error };
  }
}

/**
 * Retrieves all existing reservations.
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);

  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Creates a new reservation.
 * @param reservation 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of a new reservation saved in the database.
 */
export async function createReservation(reservation) {
  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, { data: reservation });
    return response.data.data.status;
  }
  catch (error) {
    return { message: error.response.data.error };
  }
}

/**
 * Updates a reservation.
 * @param reservation 
 * @param reservation_id 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of a updated reservation saved in the database.
 */
export async function updateReservation(reservation, reservation_id) {
  try {
    const response = await axios.put(`${API_BASE_URL}/reservations/${reservation_id}`, { data: reservation });
    return response.status;
  }
  catch (error) {
    return { message: error.response.data.error };
  }
}

/**
 * Seat a reservation at a table, updates the occupied status of a table.
 * @param reservation_id 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of a updated reservation saved in the database.
 */
export async function seatReservation(tableId, reservation_id) {
  try {
    const response = await axios.put(`${API_BASE_URL}/tables/${tableId}/seat`, { data: { reservation_id: reservation_id } })
    return response.status;
  }
  catch (error) {
    return { message: error.response.data.error };
  }
}

/**
 * Updates a reservation's status to cancelled
 * @param reservation_id 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of a updated reservation saved in the database.
 */
export async function cancelReservation(reservation_id) {
  try {
    const response = await axios.put(`${API_BASE_URL}/reservations/${reservation_id}/status`, { data: { status: 'cancelled' } })
    return response.status;
  }
  catch (error) {
    return { message: error.response.data.error };
  }
}

/**
 * Finished a table and resets it to unoccupied
 * @param tableId 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of a updated reservation saved in the database.
 */
 export async function finishTable(tableId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tables/${tableId}/seat`);
    return response.status;
  }
  catch (error) {
    return { message: error.response.data.error };
  }
}