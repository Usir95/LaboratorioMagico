import { useDBStore } from '@/database/sqlite-store';

// export const ObtenerIngredientes = async () => {
//     return [
//         { id: 1, nombre: 'Zanahoria', tipo: 'Vegetal', rareza: '1', descripcion: 'Vegetal naranja y crujiente', imagen: null },
//         { id: 2, nombre: 'Manzana', tipo: 'Fruta', rareza: '1', descripcion: 'Fruta dulce y jugosa', imagen: null },
//         { id: 3, nombre: 'Trufa', tipo: 'Hongo', rareza: '2', descripcion: 'Hongo exclusivo y aromático', imagen: null },
//         { id: 4, nombre: 'Pescado', tipo: 'Proteína', rareza: '2', descripcion: 'Pescado fresco del mar', imagen: null },
//         { id: 5, nombre: 'Pimienta', tipo: 'Especia', rareza: '2', descripcion: 'Especia picante y aromática', imagen: null },
//         { id: 6, nombre: 'Tomate', tipo: 'Vegetal', rareza: '1', descripcion: 'Vegetal rojo y jugoso', imagen: null },
//         { id: 7, nombre: 'Champiñón', tipo: 'Hongo', rareza: '1', descripcion: 'Hongo común y versátil', imagen: null },
//         { id: 8, nombre: 'Ajo', tipo: 'Especia', rareza: '1', descripcion: 'Especia aromática y sabrosa', imagen: null }
//     ];
// };

export const ObtenerIngredientes = async () => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();
    const res = await db.query("SELECT * FROM ingredientes ORDER BY nombre ASC");
    return res.values || [];
};

export const InsertarIngredientes = async (ingrediente) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(
        `INSERT INTO ingredientes (nombre, tipo, rareza, descripcion, imagen) VALUES (?, ?, ?, ?, ?)`,
        [
            ingrediente.nombre,
            ingrediente.tipo,
            ingrediente.rareza,
            ingrediente.descripcion || '',
            ingrediente.imagen || null
        ]
    );
};

export const ActualizarIngredientes = async (ingrediente) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(`UPDATE ingredientes SET nombre = ?, tipo = ?, rareza = ?, descripcion = ?, imagen = ? WHERE id = ?`,
        [ ingrediente.nombre, ingrediente.tipo, ingrediente.rareza, ingrediente.descripcion, ingrediente.imagen || null, ingrediente.id]
    );
};

export const EliminarIngrediente = async (id) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(`DELETE FROM ingredientes WHERE id = ?`, [id]);
};
