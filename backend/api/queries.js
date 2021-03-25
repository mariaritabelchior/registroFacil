module.exports = {
    materiaWithChildren: `
        WITH RECURSIVE submaterias (id) AS (
            SELECT id FROM materias WHERE id = ?
            UNION ALL
            SELECT c.id FROM submaterias, materias m
                WHERE "parentId" = submaterias.id
        )
        SELECT id FROM submaterias
    `
}