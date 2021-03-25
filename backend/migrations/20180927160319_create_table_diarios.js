
exports.up = function(knex, Promise) {
    return knex.schema.createTable('diarios', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description', 1000).notNull()
        table.binary('content').notNull()
        table.binary('report').notNull()
        table.integer('userId').references('id')
            .inTable('users').notNull()
        table.integer('materiaId').references('id')
            .inTable('materias').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('diarios')
};
