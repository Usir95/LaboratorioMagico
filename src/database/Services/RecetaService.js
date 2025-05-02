import { useDBStore } from '@/database/sqlite-store';

// export const ObtenerRecetas = async () => {
//     return [
//         { id: 1, nombre: 'Poción de invisibilidad' },
//         { id: 2, nombre: 'Elixir de la vida' },
//         { id: 3, nombre: 'Filtro de amor' },
//         { id: 4, nombre: 'Brebaje de la suerte' },
//         { id: 5, nombre: 'Poción multijugos' },
//     ];
// };

export const ObtenerRecetas = async () => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    const recetaRes = await db.query("SELECT * FROM recetas ORDER BY nombre ASC");
    const recetas = recetaRes.values || [];

    for (const receta of recetas) {
        const ingredientesRes = await db.query(`SELECT ir.ingrediente_id as id, i.nombre, ir.cantidad
            FROM ingrediente_receta ir
            JOIN ingredientes i ON i.id = ir.ingrediente_id
            WHERE ir.receta_id = ?`,
            [receta.id]
        );

        receta.ingredientes = ingredientesRes.values || [];
    }

    return recetas;
};

export const InsertarRecetas = async (data) => {
    try {
        const dbStore = useDBStore();
        const db = await dbStore.initDB();

        const result = await db.run(`INSERT INTO recetas (nombre) VALUES (?)`, [data.nombre]);
        const recetaId = result.lastInsertRowid;

        for (const item of data.ingredientes) {
            await db.run(`INSERT INTO ingrediente_receta (receta_id, ingrediente_id, cantidad) VALUES (?, ?, ?)`,
                [recetaId, item.ingrediente, item.cantidad]
            );
        }

        return { success: true };

    } catch (error) {
        console.error('Error al insertar receta:', error);
        return { success: false, error };
    }
};

export const ActualizarRecetas = async (receta) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(`UPDATE recetas SET nombre = ? WHERE id = ?`,
        [ receta.nombre]
    );
};

export const EliminarReceta = async (id) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(`DELETE FROM recetas WHERE id = ?`, [id]);
};