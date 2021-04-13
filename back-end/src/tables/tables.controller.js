const service = require('./tables.service');
const reservationService = require('../reservations/reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * ID check for exisiting tables
 */
async function checkId(req, res, next) {
  const { table_id } = req.params;
  const data = await service.read(table_id);

  if (!data)
    return next({ status: 404, message: `Table ID: ${table_id} Not Found` });
  else {
    res.locals.table = data;
    next();
  }
}

/**
 * Table request body validation for new table
 */
async function validateNewTable(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { table_name, capacity, reservation_id } = req.body.data;

  if (!table_name || table_name === '' || table_name.length === 1)
    return next({ status: 400, message: 'Invalid table_name' });

  if (!capacity || capacity === 0 || typeof capacity !== 'number')
    return next({ status: 400, message: 'Invalid capacity' });

  res.locals.newTable = { table_name, capacity };

  if (reservation_id) {
    res.locals.newTable.reservation_id = reservation_id;
    res.locals.newTable.occupied = true;
  }


  next();
}

/**
 * Update validation handler for table resources
 */
async function validateUpdate(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { reservation_id } = req.body.data;
  if (!reservation_id)
    return next({ status: 400, message: 'Missing reservation_id' });

  const reservation = await reservationService.read(reservation_id);
  if (!reservation)
    return next({ status: 404, message: `${reservation_id} does not exist` });

  if (reservation.status === 'seated')
    return next({ status: 400, message: 'Party already seated' });

  res.locals.reservation = reservation;
  next();
}

/**
 * Capacity validation handler for table resources
 */
async function validateCapacity(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  const reservation = res.locals.reservation;

  if (table.capacity < reservation.people)
    return next({ status: 400, message: `${table.table_name} does not have the capacity to seat ${reservation.people} people.` });

  if (table.occupied)
    return next({ status: 400, message: `${table.table_name} is currently occupied.` });

  next();
}

/**
 * List handler for table resources
 */
async function list(req, res) {
  const data = await service.list();

  res.json({
    data: data,
  });
}

/**
 * Read handler for table resources
 */
async function read(req, res) {
  res.json({
    data: res.locals.table,
  });
}

/**
 * Create handler for creating new tables
 */
async function create(req, res) {
  const data = await service.create(res.locals.newTable);

  res.status(201).json({
    data: data[0],
  });
}

/**
 * Update handler for table resources
 */
async function update(req, res) {
  const data = await service.update(req.params.table_id, res.locals.reservation.reservation_id);
  await reservationService.updateStatus(res.locals.reservation.reservation_id, 'seated');

  res.status(200).json({
    data: data,
  });
}

/**
 * Delete handler for table resources
 */
async function destroy(req, res, next) {
  const table = await service.read(req.params.table_id);

  if (!table.occupied)
    return next({ status: 400, message: `${table.table_name} not occupied.` });

  const data = await service.destroy(table.table_id);
  await reservationService.updateStatus(table.reservation_id, 'finished');

  res.status(200).json({
    data: data,
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(checkId), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(validateNewTable), asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(validateCapacity), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(checkId), asyncErrorBoundary(destroy)]
};