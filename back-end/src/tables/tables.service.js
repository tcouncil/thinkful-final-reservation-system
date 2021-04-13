// Service
const knex = require('../db/connection');

const list = () =>
    knex('tables').select().orderBy('table_name');

const read = (table_id) =>
    knex('tables').select().where('table_id', table_id).first();

const create = (newTable) =>
    knex('tables').insert(newTable).returning('*');

const update = (table_id, reservation_id) =>
    knex('tables').where('table_id', table_id).update({ reservation_id: reservation_id, occupied: true }).returning('*');

const destroy = (table_id) =>
    knex('tables').where('table_id', table_id).update({ reservation_id: null, occupied: false }).returning('*');

module.exports = {
    list,
    read,
    create,
    update,
    destroy
}