module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const ponto = { ...req.body
           // id: req.body.id,
            //userid: req.body.userId,
           // report: req.body.report
        }
        
        if(req.params.id) ponto.id = req.params.id

        try {
            existsOrError(ponto.userId, 'Funcionário não informado')
            existsOrError(ponto.report, 'Observação não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(ponto.id) {
            app.db('pontos')
                .update(ponto)
                .where({ id: ponto.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('pontos')
                .insert(ponto)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
           // existsOrError(req.params.id, 'Código do Ponto não informado.')

            const rowsDeleted = await app.db('pontos')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Ponto não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('pontos')
            .select('id', 'userId','report')
            .then(pontos => res.json(withPath(pontos)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('pontos')
            .where({ id: req.params.id })
            .first()
            .then(ponto => res.json(ponto))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}