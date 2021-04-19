const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * ID check for exisiting reservations
 */
async function checkId(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);

  if (!data)
    return next({ status: 404, message: `Reservation ID: ${reservation_id} Not Found` });
  else {
    res.locals.reservation = data;
    next();
  }
}

/**
 * Reservation request body validation for new reservations
 */
async function validateNewReservation(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { first_name, last_name, mobile_number, people, reservation_date, reservation_time, status } = req.body.data;

  if (!first_name)
    return next({ status: 400, message: 'Be sure to include first_name' });

  if (!last_name)
    return next({ status: 400, message: 'Be sure to include last_name' });

  if (!mobile_number)
    return next({ status: 400, message: 'Be sure to include mobile_number' });

  if (!people)
    return next({ status: 400, message: 'Be sure to include people' });

  if (!reservation_date)
    return next({ status: 400, message: 'Be sure to include reservation_date' });

  if (!reservation_time)
    return next({ status: 400, message: 'Be sure to include reservation_time' });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: 'reservation_date is invalid!' });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: 'reservation_time is invalid!' });

  if (typeof people !== 'number')
    return next({ status: 400, message: 'people is not a number!' });

  if (status === 'seated')
    return next({ status: 400, message: 'status can not be seated!' });

  if (status === 'finished')
    return next({ status: 400, message: 'status can not be finished!' });

  res.locals.reservation = { first_name, last_name, mobile_number, people, reservation_date, reservation_time };
  next();
}

/**
 * Date validation middleware
 */
async function dateValidator(req, res, next) {
  const date = new Date(res.locals.reservation.reservation_date);
  const currentDate = new Date();

  if (date.getUTCDay() === 2)
    return next({ status: 400, message: "We're closed on Tuesdays!" });

  if (date.valueOf() < currentDate.valueOf() && date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16))
    return next({ status: 400, message: "Reservations must be made in the future!" });

  next();
}

/**
 * Timeline validation middleware
 */
function timelineValidator(req, res, next) {
  // Request Time
  const time = res.locals.reservation.reservation_time;
  let hour = time[0] + time[1];
  let minutes = time[3] + time[4];
  hour = Number(hour);
  minutes = Number(minutes);

  // Current Time from Frontend Request
  const currentTime = req.body.data.current_time;
  const date = new Date(res.locals.reservation.reservation_date);
  const currentDate = new Date();

  // Checks to see if the requested time has passed and is on the current date
  if (currentTime > time && date.toUTCString().slice(0, 16) === currentDate.toUTCString().slice(0, 16))
    return next({ status: 400, message: "Time has already passed!" });

  if (hour < 10 || (hour <= 10 && minutes < 30))
    return next({ status: 400, message: "We're not open yet" });

  if (hour > 21 || (hour >= 21 && minutes > 30))
    return next({ status: 400, message: "Too close to closing time or closed!" });

  next();
}

/**
 * Status validation middleware
 */
async function validateStatusUpdate(req, res, next) {
  const currentStatus = res.locals.reservation.status;
  const { status } = req.body.data;

  if (currentStatus === 'finished')
    return next({ status: 400, message: 'a finished reservation cannot be updated' })

  if (status === 'cancelled')
    return next();

  if (status !== 'booked' && status !== 'seated' && status !== 'finished')
    return next({ status: 400, message: 'Can not update unknown status' });

  next();
}

/**
 * Update validation middleware
 */
async function validateUpdate(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { first_name, last_name, mobile_number, people, reservation_date, reservation_time } = req.body.data;

  if (!first_name)
    return next({ status: 400, message: 'Be sure to include first_name' });

  if (!last_name)
    return next({ status: 400, message: 'Be sure to include last_name' });

  if (!mobile_number)
    return next({ status: 400, message: 'Be sure to include mobile_number' });

  if (!people)
    return next({ status: 400, message: 'Be sure to include people' });

  if (!reservation_date)
    return next({ status: 400, message: 'Be sure to include reservation_date' });

  if (!reservation_time)
    return next({ status: 400, message: 'Be sure to include reservation_time' });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: 'reservation_date is invalid!' });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: 'reservation_time is invalid!' });

  if (typeof people !== 'number')
    return next({ status: 400, message: 'people is not a number!' });

  res.locals.reservation = { first_name, last_name, mobile_number, people, reservation_date, reservation_time };

  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;

  if (date) {
    const data = await service.list(date);

    res.json({
      data: data,
    });
    return;
  }

  if (mobile_number) {
    const data = await service.listByMobileNumber(mobile_number);

    res.json({
      data: data,
    });

    return;
  } else {
    res.json({
      data: [],
    });
  }
}

/**
 * Read handler for reservation resources
 */
async function read(req, res) {
  res.status(200).json({
    data: res.locals.reservation,
  });
}

/**
 * Create handler for creating new reservations
 */
async function create(req, res) {
  const data = await service.create(res.locals.reservation);

  res.status(201).json({
    data: data[0],
  });
}

/**
 * Update handler for updating the status of a reservation
 */
async function updateStatus(req, res) {
  const { reservation_id } = req.params;
  const status = req.body.data.status;
  const data = await service.updateStatus(reservation_id, status);

  res.status(200).json({
    data: { status: data[0] },
  });
}

/**
 * Update handler for updating time, date, name, people of a reservation
 */
async function update(req, res) {
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, res.locals.reservation);
  res.status(200).json({
    data: data[0],
  });
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(checkId), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(validateNewReservation), asyncErrorBoundary(dateValidator), asyncErrorBoundary(timelineValidator), asyncErrorBoundary(create)],
  updateStatus: [asyncErrorBoundary(checkId), asyncErrorBoundary(validateStatusUpdate), asyncErrorBoundary(updateStatus)],
  update: [asyncErrorBoundary(checkId), asyncErrorBoundary(validateUpdate), asyncErrorBoundary(dateValidator), asyncErrorBoundary(timelineValidator), asyncErrorBoundary(update)]
};