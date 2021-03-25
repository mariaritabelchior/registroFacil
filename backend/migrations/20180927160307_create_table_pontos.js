
exports.up = function(knex, Promise) {
    return knex.schema.createTable('pontos', table => {
        table.increments('id').primary()
        table.integer('userId').references('id')
            .inTable('users').notNull()
        table.string('report')
        //table.datetime('datedate', { precision: 6 }).defaultTo(knex.fn.now(6))
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('pontos')
};