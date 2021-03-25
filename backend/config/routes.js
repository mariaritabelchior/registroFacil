const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))

    app.route('/materias')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.materia.get))
        .post(admin(app.api.materia.save))

    // Cuidado com ordem! Tem que vir antes de /materias/:id
    app.route('/materias/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.materia.getTree)

    app.route('/materias/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.materia.getById)
        .put(admin(app.api.materia.save))
        .delete(admin(app.api.materia.remove))

    app.route('/diarios')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.diario.get))
        .post(admin(app.api.diario.save))

    app.route('/diarios/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.diario.getById)
        .put(admin(app.api.diario.save))
        .delete(admin(app.api.diario.remove))

    app.route('/materias/:id/diarios')
        .all(app.config.passport.authenticate())
        .get(app.api.diario.getByMateria)
    
    app.route('/pontos')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.ponto.get))
        .post(admin(app.api.ponto.save))

    app.route('/pontos/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.ponto.getById)
        .put(admin(app.api.ponto.save))
        .delete(admin(app.api.ponto.remove))

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)
}