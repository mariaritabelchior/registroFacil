module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        materias: Number,
        diarios: Number,
        pontos: Number,
        createdAt: Date
    })

    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })
            .then(stat => {
                const defaultStat = {
                    users: 0,
                    materias: 0,
                    diarios: 0,
                    pontos: 0
                }
                res.json(stat || defaultStat)
            })
    }

    return { Stat, get }
}