const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const materiasCount = await app.db('materias').count('id').first()
        const diariosCount = await app.db('diarios').count('id').first()
        const pontosCount = await app.db('pontos').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {},
            { sort: { 'createdAt' : -1 } })

        const stat = new Stat({
            users: usersCount.count,
            materias: materiasCount.count,
            diarios: diariosCount.count,
            pontos: pontosCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeMaterias = !lastStat || stat.materias !== lastStat.materias
        const changeDiarios = !lastStat || stat.diarios !== lastStat.diarios
        const changePontos = !lastStat || stat.pontos !== lastStat.pontos

        if(changeUsers || changeMaterias || changeDiarios || changePontos ) {
            stat.save().then(() => console.log('[Stats] Sistema atualizado!'))
        }
    })
}