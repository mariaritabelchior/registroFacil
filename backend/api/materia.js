module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const materia = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }
        
        if(req.params.id) materia.id = req.params.id

        try {
            existsOrError(materia.name, 'Matéria não informada')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(materia.id) {
            app.db('materias')
                .update(materia)
                .where({ id: materia.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('materias')
                .insert(materia)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da Materia não informado.')

            const submateria = await app.db('materias')
                .where({ parentId: req.params.id })
            notExistsOrError(submateria, 'Materia possui submaterias.')

            const diarios = await app.db('diarios')
                .where({ materiaId: req.params.id })
            notExistsOrError(diarios, 'Materia possui diarios.')

            const rowsDeleted = await app.db('materias')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Materia não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = materias => {
        const getParent = (materias, parentId) => {
            const parent = materias.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const materiasWithPath = materias.map(materia => {
            let path = materia.name
            let parent = getParent(materias, materia.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(materias, parent.parentId)
            }

            return { ...materia, path }
        })

        materiasWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return materiasWithPath
    }

    const get = (req, res) => {
        app.db('materias')
            .select('id','name')
            .then(materias => res.json(withPath(materias)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('materias')
            .where({ id: req.params.id })
            .first()
            .then(materias => res.json(materias))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (materias, tree) => {
        if(!tree) tree = materias.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(materias, materias.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('materias')
            .then(materias => res.json(toTree(materias)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}