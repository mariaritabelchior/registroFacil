module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const diario = { ...req.body }
        if(req.params.id) diario.id = req.params.id

        try {
            existsOrError(diario.data, 'Data não informado')
            existsOrError(diario.materiaId, 'Matéria não informada')
            existsOrError(diario.userId, 'Professor não informado')
            existsOrError(diario.content, 'Conteúdo não informado')
            existsOrError(diario.report, 'Relatório não informado')
        } catch(msg) {
           return res.status(400).send(msg)
        }

        if(diario.id) {
            app.db('diarios')
                .update(diario)
                .where({ id: diario.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('diarios')
                .insert(diario)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('diarios')
                .where({ id: req.params.id }).del()
                existsOrError(rowsDeleted, 'Diario não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10 // usado para paginação
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('diarios').count('id').first()
        const count = parseInt(result.count)

        app.db('diarios')
            .select('id','data','materiaId', 'userId', 'content', 'report')
            .limit(limit).offset(page * limit - limit)
            .then(diarios => res.json({ data: diarios, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('diarios')
            .where({ id: req.params.id })
            .first()
            .then(diario => {
                diario.content = diario.content.toString()
                return res.json(diario)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByMateria = async (req, res) => {
        const materiaId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.materiaWithChildren, materiaId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'diarios', u: 'users'})
            .select('a.id', 'a.data', 'a.materiaId', 'a.userId', 'a.content', 'a.report', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('materiaId', ids)
            .orderBy('a.id', 'desc')
            .then(diarios => res.json(diarios))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByMateria }
}