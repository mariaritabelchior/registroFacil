
exports.up = function(knex, Promise) {
    return knex.schema.createTable('materias', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('parentId').references('id')
            .inTable('materias')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('materias')
};
